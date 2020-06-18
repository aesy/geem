import { Mesh } from '../Renderer/Mesh';
import { Chunk } from '../WorldGen/Chunk';
import { Entity } from './Entity';

export class ChunkMesh extends Entity {
    public constructor(
        public readonly chunk: Chunk,
        public readonly mesh: Mesh
    ) {
        super();

        mesh.transform.translate([ chunk.x * Chunk.SIZE, chunk.y * Chunk.SIZE, chunk.z * Chunk.SIZE ]);
        this.addComponent(mesh);
    }
}
