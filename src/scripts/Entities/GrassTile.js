import { BoxGeometry, MeshPhysicalMaterial, Mesh, MeshBasicMaterial } from 'three';
import Entity from './Entity';
import Rotate from '../Components/Rotate';

export default class GrassTile extends Entity {
    constructor() {
        super();

        const geometry = new BoxGeometry(10, 10, 10);
        const topMaterial = new MeshBasicMaterial({color: 0x8cba51});
        const otherMaterial = new MeshBasicMaterial({color: 0xe08f62});
        const materials = [
            otherMaterial,
            otherMaterial,
            topMaterial,
            otherMaterial,
            otherMaterial,
            otherMaterial
        ];
        const mesh = new Mesh(geometry, materials);

        this.addComponents(mesh, new Rotate(1, 1, 1));
    }
}