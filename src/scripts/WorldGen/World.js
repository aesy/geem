import { makeNoise2D } from 'open-simplex-noise';
import Block from './Block';
import Chunk from './Chunk';

const noise = makeNoise2D(Math.random() * Number.MAX_SAFE_INTEGER);
const amplitude = 35;
const frequency = 1.5;

export default class World {
    static CHUNK_SIZE = 32;

    chunks = [];

    getChunk(x, y, z) {
        const index = x + y * World.CHUNK_SIZE + z * World.CHUNK_SIZE * World.CHUNK_SIZE;
        let chunk = this.chunks[ index ];

        if (!chunk) {
            chunk = new Chunk(x, y, z, this);
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
        const xOffset = x / 100;
        const zOffset = z / 100;
        const layer1 = noise(zOffset * frequency, xOffset * frequency);
        const layer2 = 0.5 * noise(zOffset * frequency * 2, xOffset * frequency * 2);
        const layer3 = 0.25 * noise(zOffset * frequency * 4, xOffset * frequency * 4);
        const limit = amplitude * ((layer1 + layer2 + layer3) + 1) / 2;

        const isGround = y <= Math.round(limit);

        let type;

        if (isGround && y > 30) {
            type = Block.Type.SNOW;
        } else if (isGround && y > 20) {
            type = Block.Type.STONE;
        } else if (isGround && y > 11) {
            type = Block.Type.DIRT;
        } else if (isGround && y <= 11) {
            type = Block.Type.SAND;
        } else if (y <= 10) {
            type = Block.Type.WATER;
        } else {
            type = Block.Type.AIR;
        }

        return new Block(x, y, z, type, this);
    }
}