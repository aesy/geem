import { Mesh, MeshLambertMaterial, NearestFilter, RepeatWrapping, TextureLoader } from 'three';
import textureAtlas from '../../assets/images/textureAtlas.png';
import Entity from './Entity';
import CullingChunkMesher from '../WorldGen/CullingChunkMesher';
import Block from '../WorldGen/Block';
import Chunk from '../WorldGen/Chunk';

const mesher = new CullingChunkMesher([
    Block.Type.LEAVES
]);

const loader = new TextureLoader();
const texture = loader.load(textureAtlas);
texture.wrapS = RepeatWrapping;
texture.wrapT = RepeatWrapping;
texture.magFilter = NearestFilter;
texture.minFilter = NearestFilter;
const material = new MeshLambertMaterial({ map: texture, transparent: true });

export default class Leaves extends Entity {
    constructor(chunk: Chunk) {
        super();

        const geometry = mesher.createGeometry(chunk);
        const mesh = new Mesh(geometry, material);

        this.addComponent(mesh);
    }
}
