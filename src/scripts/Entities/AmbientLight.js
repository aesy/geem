import Entity from './Entity';
import { AmbientLight as ThreeAmbientLight } from 'three';

export default class AmbientLight extends Entity {
    constructor(intensity) {
        super();

        const light = new ThreeAmbientLight(0xFFFFFF, intensity);

        this.addComponent(light);
    }
}