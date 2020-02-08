import Block from './Block';
import Chunk from './Chunk';
import ChunkGenerator from './ChunkGenerator';

const chunkGenerator = new ChunkGenerator();

export default class World {
    static CHUNK_SIZE = 32;

    octant1: Chunk[] = []; // +x, +y, +z
    octant2: Chunk[] = []; // -x, +y, +z
    octant3: Chunk[] = []; // +x, -y, +z
    octant4: Chunk[] = []; // -x, -y, +z
    octant5: Chunk[] = []; // +x, +y, -z
    octant6: Chunk[] = []; // -x, +y, -z
    octant7: Chunk[] = []; // +x, -y, -z
    octant8: Chunk[] = []; // -x, -y, -z

    getChunk(x: number, y: number, z: number): Chunk {
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

    setBlock(x: number, y: number, z: number, type: number): void {
        const chunkX = Math.floor(x / World.CHUNK_SIZE);
        const chunkY = Math.floor(y / World.CHUNK_SIZE);
        const chunkZ = Math.floor(z / World.CHUNK_SIZE);
        const blockX = x - chunkX * World.CHUNK_SIZE;
        const blockY = y - chunkY * World.CHUNK_SIZE;
        const blockZ = z - chunkZ * World.CHUNK_SIZE;
        const chunk = this.getChunk(chunkX, chunkY, chunkZ);

        chunk.setBlock(blockX, blockY, blockZ, type);
    }

    getBlock(x: number, y: number, z: number): Block {
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
