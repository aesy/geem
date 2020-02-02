import Block from './Block';
import ChunkGenerator from './ChunkGenerator';

const chunkGenerator = new ChunkGenerator();

export default class World {
    static CHUNK_SIZE = 32;

    chunks = [];

    getChunk(x, y, z) {
        const index = x + y * World.CHUNK_SIZE + z * World.CHUNK_SIZE * World.CHUNK_SIZE;
        let chunk = this.chunks[ index ];

        if (!chunk) {
            chunk = chunkGenerator.generateChunk(x, y, z, this);
            this.chunks[ index ] = chunk;
        }

        return chunk;
    }

    setBlock(x, y, z, type) {
        const chunkX = Math.floor(x / World.CHUNK_SIZE);
        const chunkY = Math.floor(y / World.CHUNK_SIZE);
        const chunkZ = Math.floor(z / World.CHUNK_SIZE);
        const blockX = x - chunkX * World.CHUNK_SIZE;
        const blockY = y - chunkY * World.CHUNK_SIZE;
        const blockZ = z - chunkZ * World.CHUNK_SIZE;
        const chunk = this.getChunk(chunkX, chunkY, chunkZ);
        const block = new Block(x, y, z, type, this);

        chunk.setBlock(blockX, blockY, blockZ, block);
    }

    getBlock(x, y, z) {
        const chunkX = Math.floor(x / World.CHUNK_SIZE);
        const chunkY = Math.floor(y / World.CHUNK_SIZE);
        const chunkZ = Math.floor(z / World.CHUNK_SIZE);
        const blockX = x - chunkX * World.CHUNK_SIZE;
        const blockY = y - chunkY * World.CHUNK_SIZE;
        const blockZ = z - chunkZ * World.CHUNK_SIZE;
        const chunk = this.getChunk(chunkX, chunkY, chunkZ);

        return chunk.getBlock(blockX, blockY, blockZ);
    }
}
