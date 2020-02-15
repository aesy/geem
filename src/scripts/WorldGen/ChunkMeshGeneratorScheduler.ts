import { Deferred } from '../Util/Async';
import { Coordinate3, MeshData } from '../Util/Math';
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

export class OffloadedChunkMeshGeneratorScheduler implements ChunkMeshGeneratorScheduler {
    private readonly worker: Worker;
    private readonly map: Map<Chunk, Deferred<MeshData>>;
    private running: number;

    public constructor(
        private readonly queueSize: number = -1,
        private readonly concurrencyLimit: number = 3
    ) {
        this.worker = new Worker('../Worker/ChunkMesherWorker.ts',
            { name: 'ChunkMesher', type: 'module' });
        this.worker.onmessage = this.onNewMesh.bind(this);
        this.map = new Map();
        this.running = 0;
    }

    public static isSupported(): boolean {
        return typeof Worker !== 'undefined';
    }

    public dispose(): void {
        this.worker.terminate();
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

        return deferred.promise;
    }

    private next(): void {
        for (const chunk of this.map.keys()) {
            if (this.running >= this.concurrencyLimit) {
                return;
            }

            this.running++;
            this.worker.postMessage({ x: chunk.x, y: chunk.y, z: chunk.z, chunkData: chunk.data });
        }
    }

    private onNewMesh(event: MessageEvent): void {
        const { x, y, z }: Coordinate3 = event.data;
        const meshData: MeshData = event.data.meshData;
        const chunk = this.findChunk({ x, y, z });

        if (!chunk) {
            // TODO log warn
            debugger;
            return;
        }

        const deferred = this.map.get(chunk)!;
        this.map.delete(chunk);
        this.running--;

        deferred.resolve(meshData);
        this.next();
    }

    private findChunk(position: Coordinate3): Chunk | null {
        for (const chunk of this.map.keys()) {
            if (chunk.x === position.x && chunk.y === position.y && chunk.z === position.z) {
                return chunk;
            }
        }

        return null;
    }
}
