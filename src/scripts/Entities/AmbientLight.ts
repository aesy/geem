import { AmbientLight as ThreeAmbientLight } from 'three';
import Entity from './Entity';

export default class AmbientLight extends Entity {
    constructor(intensity: number) {
        super();

        const light = new ThreeAmbientLight(0xFFFFFF, intensity);

        this.addComponent(light);
    }
}
