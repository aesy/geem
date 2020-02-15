import { Chunk } from '../WorldGen/Chunk';

export class ChunkUnloaded {
    public constructor(
        public readonly chunk: Chunk
    ) {}
}
