import textureAtlas from '../../assets/images/textureAtlas.png';
import { Mesh, MeshLambertMaterial, NearestFilter, TextureLoader } from 'three';
import CullingChunkMesher from './CullingChunkMesher';
import GreedyChunkMesher from './GreedyChunkMesher';
import World from './World';

const loader = new TextureLoader();
const texture = loader.load(textureAtlas);
texture.magFilter = NearestFilter;
texture.minFilter = NearestFilter;
const material = new MeshLambertMaterial({ map: texture, transparent: true });

export default class Chunk {
    constructor(x, y, z, world) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.world = world;
        this.mesh = null;
    }

    get width() {
        return World.CHUNK_SIZE;
    }

    get height() {
        return World.CHUNK_SIZE;
    }

    get depth() {
        return World.CHUNK_SIZE;
    }

    getBlock(x, y, z) {
        const xOffset = this.x * this.width;
        const yOffset = this.y * this.height;
        const zOffset = this.z * this.depth;

        return this.world.getBlock(x + xOffset, y + yOffset, z + zOffset);
    }

    getMesh() {
        if (this.mesh === null) {
            const geometry = new CullingChunkMesher().createGeometry(this);

            this.mesh = new Mesh(geometry, material);
        }

        return this.mesh;
    }
}
