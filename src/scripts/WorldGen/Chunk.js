import Block from './Block';
import World from './World';

export default class Chunk {
    constructor(x, y, z, world) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.world = world;
        this.data = new Array(World.CHUNK_SIZE * World.CHUNK_SIZE * World.CHUNK_SIZE);
    }

    setBlock(x, y, z, type) {
        if (x < 0 || x >= World.CHUNK_SIZE || y < 0 || y >= World.CHUNK_SIZE || z < 0 || z >= World.CHUNK_SIZE) {
            // TODO setBlock in world
            return;
        }

        const xOffset = this.x * World.CHUNK_SIZE;
        const yOffset = this.y * World.CHUNK_SIZE;
        const zOffset = this.z * World.CHUNK_SIZE;
        const block = new Block(xOffset + x, yOffset + y, zOffset + z, type, this.world);

        this.data[ x + y * World.CHUNK_SIZE + z * World.CHUNK_SIZE * World.CHUNK_SIZE ] = block;
    }

    getBlock(x, y, z) {
        if (x < 0 || x >= World.CHUNK_SIZE || y < 0 || y >= World.CHUNK_SIZE || z < 0 || z >= World.CHUNK_SIZE) {
            const xOffset = this.x * World.CHUNK_SIZE;
            const yOffset = this.y * World.CHUNK_SIZE;
            const zOffset = this.z * World.CHUNK_SIZE;

            return this.world.getBlock(x + xOffset, y + yOffset, z + zOffset);
        }

        return this.data[ x + y * World.CHUNK_SIZE + z * World.CHUNK_SIZE * World.CHUNK_SIZE ];
    }
}
