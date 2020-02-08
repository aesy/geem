import { Mesh, MeshLambertMaterial, NearestFilter, RepeatWrapping, TextureLoader } from 'three';
import textureAtlas from '../../assets/images/textureAtlas.png';
import Block from '../WorldGen/Block';
import Chunk from '../WorldGen/Chunk';
import CullingChunkMesher from '../WorldGen/CullingChunkMesher';
import Entity from './Entity';

const mesher = new CullingChunkMesher([
    Block.Type.WATER
]);

const loader = new TextureLoader();
const texture = loader.load(textureAtlas);
texture.wrapS = RepeatWrapping;
texture.wrapT = RepeatWrapping;
texture.magFilter = NearestFilter;
texture.minFilter = NearestFilter;
const material = new MeshLambertMaterial({ map: texture, transparent: true });

export default class Water extends Entity {
    constructor(chunk: Chunk) {
        super();

        const geometry = mesher.createGeometry(chunk);
        const mesh = new Mesh(geometry, material);

        this.addComponent(mesh);
    }
}
