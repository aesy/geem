import Block from './Block';
import ChunkGenerator from './ChunkGenerator';

const chunkGenerator = new ChunkGenerator();

export default class World {
    static CHUNK_SIZE = 32;

    octant1 = []; // +x, +y, +z
    octant2 = []; // -x, +y, +z
    octant3 = []; // +x, -y, +z
    octant4 = []; // -x, -y, +z
    octant5 = []; // +x, +y, -z
    octant6 = []; // -x, +y, -z
    octant7 = []; // +x, -y, -z
    octant8 = []; // -x, -y, -z

    getChunk(x, y, z) {
        const index = Math.abs(x) + Math.abs(y) * World.CHUNK_SIZE + Math.abs(z) * World.CHUNK_SIZE * World.CHUNK_SIZE;
        const positiveX = x >= 0;
        const positiveY = y >= 0;
        const positiveZ = z >= 0;
        let chunks;

        if (positiveX && positiveY && positiveZ) {
            chunks = this.octant1;
        } else if (!positiveX && positiveY && positiveZ) {
            chunks = this.octant2;
        } else if (positiveX && !positiveY && positiveZ) {
            chunks = this.octant3;
        } else if (!positiveX && !positiveY && positiveZ) {
            chunks = this.octant4;
        } else if (positiveX && positiveY && !positiveZ) {
            chunks = this.octant5;
        } else if (!positiveX && positiveY && !positiveZ) {
            chunks = this.octant6;
        } else if (positiveX && !positiveY && !positiveZ) {
            chunks = this.octant7;
        } else if (!positiveX && !positiveY && !positiveZ) {
            chunks = this.octant8;
        } else {
            throw `Trying to get a chunk in unknown octant (x: ${ x }, y: ${ y },z: ${ z }), this should not happen.`;
        }

        let chunk = chunks[ index ];

        if (!chunk) {
            console.log(`Generating chunk (x: ${ x }, y: ${ y }, z: ${ z })`);
            chunk = chunkGenerator.generateChunk(x, y, z, this);
            chunks[ index ] = chunk;
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
