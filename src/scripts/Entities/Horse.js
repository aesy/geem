import Entity from './Entity';
import Health from '../Components/Health';
import Mana from '../Components/Mana';
import { CylinderGeometry, MeshPhysicalMaterial, Mesh } from 'three';

export default class Horse extends Entity {
    constructor() {
        super();

        const geometry = new CylinderGeometry(5, 5, 20, 32);
        const material = new MeshPhysicalMaterial({ color: 0xff0000});
        const mesh = new Mesh(geometry, material);

        this.components = [
            new Health(100),
            new Mana(100),
            mesh,
        ];
    }

}