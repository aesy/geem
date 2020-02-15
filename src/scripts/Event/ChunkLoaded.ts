import { Chunk } from '../WorldGen/Chunk';

export class ChunkLoaded {
    public constructor(
        public readonly chunk: Chunk
    ) {}
}
