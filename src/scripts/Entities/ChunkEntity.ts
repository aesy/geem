import textureAtlas from '../../assets/images/textureAtlas.png';
import {
    BufferAttribute,
    BufferGeometry,
    Mesh,
    MeshLambertMaterial,
    NearestFilter,
    RepeatWrapping,
    TextureLoader
} from 'three';
import { MeshData } from '../Util/Math';
import { Chunk } from '../WorldGen/Chunk';
import { Entity } from './Entity';

const loader = new TextureLoader();
const texture = loader.load(textureAtlas);
texture.wrapS = RepeatWrapping;
texture.wrapT = RepeatWrapping;
texture.magFilter = NearestFilter;
texture.minFilter = NearestFilter;
const material = new MeshLambertMaterial({ map: texture });

export class ChunkEntity extends Entity {
    public constructor(
        public readonly chunk: Chunk,
        data: MeshData
    ) {
        super();

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new BufferAttribute(new Float32Array(data.vertices), 3));
        geometry.setAttribute('normal', new BufferAttribute(new Float32Array(data.normals), 3));
        geometry.setAttribute('uv', new BufferAttribute(new Float32Array(data.uvs), 2));
        geometry.setIndex(data.indices);

        const mesh = new Mesh(geometry, material);
        mesh.position.set(chunk.x * Chunk.SIZE, chunk.y * Chunk.SIZE, chunk.z * Chunk.SIZE);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        this.addComponent(mesh);
    }
}
