import CullingChunkMesher from './CullingChunkMesher';
import World from './World';

const mesher = new CullingChunkMesher();

export default class Chunk {
    constructor(x, y, z, world) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.world = world;
        this.mesh = null;
        this.data = new Array(World.CHUNK_SIZE * World.CHUNK_SIZE * World.CHUNK_SIZE);

        const xOffset = x * World.CHUNK_SIZE;
        const yOffset = y * World.CHUNK_SIZE;
        const zOffset = z * World.CHUNK_SIZE;

        for (let x = 0; x < World.CHUNK_SIZE; x++) {
            for (let y = 0; y < World.CHUNK_SIZE; y++) {
                for (let z = 0; z < World.CHUNK_SIZE; z++) {
                    const block = this.world.getBlock(x + xOffset, y + yOffset, z + zOffset);

                    this.data[ x + y * World.CHUNK_SIZE + z * World.CHUNK_SIZE * World.CHUNK_SIZE ] = block;
                }
            }
        }
    }

    setBlock(x, y, z, type) {
        const xOffset = this.x * World.CHUNK_SIZE;
        const yOffset = this.y * World.CHUNK_SIZE;
        const zOffset = this.z * World.CHUNK_SIZE;
        const block = { x: xOffset + x, y: yOffset + y, z: zOffset + z, type };

        this.data[ x + y * World.CHUNK_SIZE + z * World.CHUNK_SIZE * World.CHUNK_SIZE ] = block;
        this.mesh = null;
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

    getMesh() {
        if (this.mesh === null) {
            this.mesh = mesher.createMesh(this);
        }

        return this.mesh;
    }
}
