import Entity from './Entity';
import { PointLight as ThreePointLight } from 'three';

export default class PointLight extends Entity {
    constructor() {
        super();

        const light = new ThreePointLight(0xff0000, 1, 100);
        light.position.set(20, 20, 20);      

        this.components = [
            light,            
        ];
    }

}