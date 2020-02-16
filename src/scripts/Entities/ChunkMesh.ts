import { BufferGeometry, Material, Mesh } from 'three';
import { Chunk } from '../WorldGen/Chunk';
import { Entity } from './Entity';

export class ChunkMesh extends Entity {
    public constructor(
        public readonly chunk: Chunk,
        geometry: BufferGeometry,
        material: Material
    ) {
        super();

        const mesh = new Mesh(geometry, material);
        mesh.position.set(chunk.x * Chunk.SIZE, chunk.y * Chunk.SIZE, chunk.z * Chunk.SIZE);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        this.addComponent(mesh);
    }
}
