import { Mesh, MeshLambertMaterial, NearestFilter, RepeatWrapping, TextureLoader } from 'three';
import textureAtlas from 'images/textureAtlas.png';
import Entity from './Entity';
import CullingChunkMesher from '../WorldGen/CullingChunkMesher';
import Block from '../WorldGen/Block';
import Chunk from '../WorldGen/Chunk';

const mesher = new CullingChunkMesher([
    Block.Type.DIRT,
    Block.Type.SAND,
    Block.Type.SNOW,
    Block.Type.STONE,
    Block.Type.TREE
]);

const loader = new TextureLoader();
const texture = loader.load(textureAtlas);
texture.wrapS = RepeatWrapping;
texture.wrapT = RepeatWrapping;
texture.magFilter = NearestFilter;
texture.minFilter = NearestFilter;
const material = new MeshLambertMaterial({ map: texture });

export default class Terrain extends Entity {
    constructor(chunk: Chunk) {
        super();

        const geometry = mesher.createGeometry(chunk);
        const mesh = new Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        this.addComponent(mesh);
    }
}
