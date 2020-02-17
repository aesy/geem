import { Deferred } from '../Util/Async';
import { Coordinate3 } from '../Util/Math';
import { Constructor } from '../Util/Type';
import { Chunk, ChunkData, ChunkGenerator } from './Chunk';

export interface ChunkGeneratorScheduler {
    schedule(chunk: Chunk): Promise<ChunkData>;
}

export class InstantChunkDataGeneratorScheduler implements ChunkGeneratorScheduler {
    public constructor(
        private readonly chunkGenerator: ChunkGenerator
    ) {}

    public schedule(chunk: Chunk): Promise<ChunkData> {
        this.chunkGenerator.generateChunk(chunk);

        return Promise.resolve(chunk.data);
    }
}

export class AsyncChunkDataGeneratorScheduler implements ChunkGeneratorScheduler {
    private readonly deferred: Map<Chunk, Deferred<ChunkData>>;
    private readonly toBeStarted: Set<Chunk>;
    private running: number;

    public constructor(
        private readonly chunkGenerator: ChunkGenerator,
        private readonly queueSize: number = -1,
        private readonly concurrencyLimit: number = 1
    ) {
        this.deferred = new Map();
        this.toBeStarted = new Set();
        this.running = 0;
    }

    public schedule(chunk: Chunk): Promise<ChunkData> {
        if (this.queueSize >= 0 && this.deferred.size >= this.queueSize) {
            return Promise.reject('Queue is full');
        }

        let deferred = this.deferred.get(chunk);

        if (deferred) {
            return deferred.promise;
        } else {
            deferred = new Deferred<ChunkData>();
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
                this.chunkGenerator.generateChunk(chunk);
                this.deferred.delete(chunk);
                this.running--;

                const deferred = this.deferred.get(chunk)!;
                deferred.resolve(chunk.data);
            }, 0);
        }
    }
}

export class OffloadedChunkDataGeneratorScheduler implements ChunkGeneratorScheduler {
    private readonly worker: Worker;
    private readonly deferred: Map<Chunk, Deferred<ChunkData>>;
    private readonly toBeStarted: Set<Chunk>;
    private running: number;

    public constructor(
        private readonly chunkGenerator: Constructor<ChunkGenerator>,
        private readonly args: any[],
        private readonly queueSize: number = -1,
        private readonly concurrencyLimit: number = 3
    ) {
        this.worker = new Worker('../Worker/ChunkGenerationWorker.ts',
            { name: 'ChunkWorker', type: 'module' });
        this.worker.onmessage = this.onNewChunk.bind(this);
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

    public schedule(chunk: Chunk): Promise<ChunkData> {
        if (this.queueSize >= 0 && this.deferred.size >= this.queueSize) {
            return Promise.reject('Queue is full');
        }

        let deferred = this.deferred.get(chunk);

        if (deferred) {
            return deferred.promise;
        } else {
            deferred = new Deferred<ChunkData>();
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
                impl: this.chunkGenerator.name,
                args: this.args
            });
        }
    }

    private onNewChunk(event: MessageEvent): void {
        const { x, y, z }: Coordinate3 = event.data;
        const chunkData: ChunkData = event.data.chunkData;
        const chunk = this.findChunk({ x, y, z });

        if (!chunk) {
            return;
        }

        chunk.data = chunkData;

        const deferred = this.deferred.get(chunk)!;
        this.deferred.delete(chunk);
        this.running--;

        deferred.resolve(chunk.data);
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
