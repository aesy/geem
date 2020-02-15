import { Deferred } from '../Util/Async';
import { MeshData } from '../Util/Math';
import { Chunk, ChunkMesher } from './Chunk';

export interface ChunkMeshGeneratorScheduler {
    schedule(chunk: Chunk): Promise<MeshData>;
}

export class InstantChunkMeshGeneratorScheduler implements ChunkMeshGeneratorScheduler {
    public constructor(
        private readonly mesher: ChunkMesher,
    ) {}

    public schedule(chunk: Chunk): Promise<MeshData> {
        const meshData = this.mesher.createMesh(chunk);

        return Promise.resolve(meshData);
    }
}

export class AsyncChunkMeshGeneratorScheduler implements ChunkMeshGeneratorScheduler {
    private readonly map: Map<Chunk, Deferred<MeshData>>;
    private running: number;

    public constructor(
        private readonly mesher: ChunkMesher,
        private readonly queueSize: number = -1,
        private readonly concurrencyLimit: number = 1
    ) {
        this.map = new Map();
        this.running = 0;
    }

    public schedule(chunk: Chunk): Promise<MeshData> {
        let deferred = this.map.get(chunk);

        if (deferred) {
            return deferred.promise;
        } else {
            deferred = new Deferred<MeshData>();
            this.map.set(chunk, deferred);
        }

        if (this.queueSize >= 0 && this.map.size >= this.queueSize) {
            deferred.reject('Queue is full');

            return deferred.promise;
        }

        this.next();

        return deferred.promise.then(data => {
            this.next();

            return data;
        });
    }

    private next(): void {
        for (const [ chunk, deferred ] of this.map) {
            if (this.running >= this.concurrencyLimit) {
                return;
            }

            this.running++;

            setTimeout(() => {
                const meshData = this.mesher.createMesh(chunk);
                this.map.delete(chunk);
                this.running--;

                deferred.resolve(meshData);
            }, 0);
        }
    }
}
