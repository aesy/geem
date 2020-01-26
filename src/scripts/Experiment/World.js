import { makeNoise2D } from 'open-simplex-noise';
import { Block } from './Block';
import Chunk from './Chunk';

const noise = makeNoise2D(Math.random() * Number.MAX_SAFE_INTEGER);
const amplitude = 20;
const frequency = 2;

export default class World {
    static CHUNK_SIZE = 32;

    getChunk(x, y, z) {
        // TODO cache
        return new Chunk(x, y, z, this);
    }

    getBlock(x, y, z) {
        const block = { x, y, z };
        const xOffset = x / 100;
        const zOffset = z / 100;
        const layer1 = noise(zOffset * frequency, xOffset * frequency);
        const layer2 = 0.5 * noise(zOffset * frequency * 2, xOffset * frequency * 2);
        const layer3 = 0.25 * noise(zOffset * frequency * 4, xOffset * frequency * 4);
        const limit = amplitude * ((layer1 + layer2 + layer3) + 1) / 2;

        if (y <= Math.round(limit)) {
            block.type = Block.Type.DIRT;
        } else if (y <= 10) {
            block.type = Block.Type.WATER;
        } else {
            block.type = Block.Type.AIR;
        }

        return block;
    }
}
