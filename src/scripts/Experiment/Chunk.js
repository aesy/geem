import textureAtlas from '../../assets/images/textureAtlas.png';
import { Mesh, MeshLambertMaterial, NearestFilter, TextureLoader } from 'three';
import CullingChunkMesher from './CullingChunkMesher';
import World from './World';

const loader = new TextureLoader();
const texture = loader.load(textureAtlas);
texture.magFilter = NearestFilter;
texture.minFilter = NearestFilter;
const material = new MeshLambertMaterial({ map: texture });

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

    getMesh() {
        if (this.mesh === null) {
            const geometry = new CullingChunkMesher().createGeometry(this);

            this.mesh = new Mesh(geometry, material);
        }

        return this.mesh;
    }
}
