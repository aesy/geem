import Entity from './Entity';
import { MeshBasicMaterial, SphereGeometry, Mesh } from 'three';

export default class Example extends Entity {
    constructor() {
        super();

        const material = new MeshBasicMaterial({ color: 0xFF00FF });
        const geometry = new SphereGeometry(5, 32, 32);
        const mesh = new Mesh(geometry, material);

        this.addComponents(mesh);
    }
}
