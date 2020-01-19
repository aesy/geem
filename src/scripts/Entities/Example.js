import Entity from './Entity';
import { MeshPhysicalMaterial, SphereGeometry, Mesh } from 'three'; 

export default class Example extends Entity {
    constructor(){
        super();
        const geometry = new SphereGeometry(5, 32, 32);
        const material = new MeshPhysicalMaterial({color: 0xFF00FF});

        const mesh = new Mesh(geometry, material);

        this.components = [
            mesh,
        ];
    }
}

