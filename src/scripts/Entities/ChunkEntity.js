import Entity from './Entity';

export default class ChunkEntity extends Entity {
    constructor(chunk) {
        super();

        const mesh = chunk.getMesh();
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        this.addComponent(mesh);
    }
}
