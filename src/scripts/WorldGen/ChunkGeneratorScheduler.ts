import { Deferred } from '../Util/Async';
import { Chunk, ChunkData, ChunkGenerator } from './Chunk';

export interface ChunkGeneratorScheduler {
    schedule(chunk: Chunk): Promise<ChunkData>;
}

export class InstantChunkDataGeneratorScheduler implements ChunkGeneratorScheduler {
    public constructor(
        private readonly chunkGenerator: ChunkGenerator,
    ) {}

    public schedule(chunk: Chunk): Promise<ChunkData> {
        this.chunkGenerator.generateChunk(chunk);

        return Promise.resolve(chunk.data);
    }
}

export class AsyncChunkDataGeneratorScheduler implements ChunkGeneratorScheduler {
    private readonly map: Map<Chunk, Deferred<ChunkData>>;
    private running: number;

    public constructor(
        private readonly chunkGenerator: ChunkGenerator,
        private readonly queueSize: number = -1,
        private readonly concurrencyLimit: number = 1
    ) {
        this.map = new Map();
        this.running = 0;
    }

    public schedule(chunk: Chunk): Promise<ChunkData> {
        let deferred = this.map.get(chunk);

        if (deferred) {
            return deferred.promise;
        } else {
            deferred = new Deferred<ChunkData>();
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
        for (const [chunk, deferred] of this.map) {
            if (this.running >= this.concurrencyLimit) {
                return;
            }

            this.running++;

            setTimeout(() => {
                this.chunkGenerator.generateChunk(chunk);
                this.map.delete(chunk);
                this.running--;

                deferred.resolve(chunk.data);
            }, 0);
        }
    }
}
