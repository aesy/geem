import { Deferred } from '../Util/Async';
import { Coordinate3, MeshData } from '../Util/Math';
import { Constructor } from '../Util/Type';
import { Chunk, ChunkMesher } from './Chunk';

export interface ChunkMeshGeneratorScheduler {
    schedule(chunk: Chunk): Promise<MeshData>;
}

export class InstantChunkMeshGeneratorScheduler implements ChunkMeshGeneratorScheduler {
    public constructor(
        private readonly mesher: ChunkMesher
    ) {}

    public schedule(chunk: Chunk): Promise<MeshData> {
        const meshData = this.mesher.createMesh(chunk);

        return Promise.resolve(meshData);
    }
}

export class AsyncChunkMeshGeneratorScheduler implements ChunkMeshGeneratorScheduler {
    private readonly deferred: Map<Chunk, Deferred<MeshData>>;
    private readonly toBeStarted: Set<Chunk>;
    private running: number;

    public constructor(
        private readonly mesher: ChunkMesher,
        private readonly queueSize: number = -1,
        private readonly concurrencyLimit: number = 1
    ) {
        this.deferred = new Map();
        this.toBeStarted = new Set();
        this.running = 0;
    }

    public schedule(chunk: Chunk): Promise<MeshData> {
        if (this.queueSize >= 0 && this.deferred.size >= this.queueSize) {
            return Promise.reject('Queue is full');
        }

        let deferred = this.deferred.get(chunk);

        if (deferred) {
            return deferred.promise;
        } else {
            deferred = new Deferred<MeshData>();
            this.deferred.set(chunk, deferred);
        }

        this.toBeStarted.add(chunk);
        this.next();

        return deferred.promise.then(data => {
            this.next();

            return data;
        });
    }

    private next(): void {
        for (const chunk of this.toBeStarted) {
            if (this.running >= this.concurrencyLimit) {
                return;
            }

            this.running++;
            this.toBeStarted.delete(chunk);

            setTimeout(() => {
                const meshData = this.mesher.createMesh(chunk);
                this.deferred.delete(chunk);
                this.running--;

                const deferred = this.deferred.get(chunk)!;
                deferred.resolve(meshData);
            }, 0);
        }
    }
}

export class OffloadedChunkMeshGeneratorScheduler implements ChunkMeshGeneratorScheduler {
    private readonly worker: Worker;
    private readonly deferred: Map<Chunk, Deferred<MeshData>>;
    private readonly toBeStarted: Set<Chunk>;
    private running: number;

    public constructor(
        private readonly mesher: Constructor<ChunkMesher>,
        private readonly args: any[],
        private readonly queueSize: number = -1,
        private readonly concurrencyLimit: number = 3
    ) {
        this.worker = new Worker('../Worker/ChunkMesherWorker.ts',
            { name: 'ChunkMesher', type: 'module' });
        this.worker.onmessage = this.onNewMesh.bind(this);
        this.deferred = new Map();
        this.toBeStarted = new Set();
        this.running = 0;
    }

    public static isSupported(): boolean {
        return typeof Worker !== 'undefined';
    }

    public dispose(): void {
        this.worker.terminate();
    }

    public schedule(chunk: Chunk): Promise<MeshData> {
        if (this.queueSize >= 0 && this.deferred.size >= this.queueSize) {
            return Promise.reject('Queue is full');
        }

        let deferred = this.deferred.get(chunk);

        if (deferred) {
            return deferred.promise;
        } else {
            deferred = new Deferred<MeshData>();
            this.deferred.set(chunk, deferred);
        }

        this.toBeStarted.add(chunk);
        this.next();

        return deferred.promise;
    }

    private next(): void {
        for (const chunk of this.toBeStarted) {
            if (this.running >= this.concurrencyLimit) {
                return;
            }

            this.running++;
            this.toBeStarted.delete(chunk);
            this.worker.postMessage({
                x: chunk.x,
                y: chunk.y,
                z: chunk.z,
                chunkData: chunk.data,
                impl: this.mesher.name,
                args: this.args
            });
        }
    }

    private onNewMesh(event: MessageEvent): void {
        const { x, y, z }: Coordinate3 = event.data;
        const meshData: MeshData = event.data.meshData;
        const chunk = this.findChunk({ x, y, z });

        if (!chunk) {
            return;
        }

        const deferred = this.deferred.get(chunk)!;
        this.deferred.delete(chunk);
        this.running--;

        deferred.resolve(meshData);
        this.next();
    }

    private findChunk(position: Coordinate3): Chunk | null {
        for (const chunk of this.deferred.keys()) {
            if (chunk.x === position.x && chunk.y === position.y && chunk.z === position.z) {
                return chunk;
            }
        }

        return null;
    }
}
