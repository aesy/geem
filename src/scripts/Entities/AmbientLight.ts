import { AmbientLight as ThreeAmbientLight } from 'three';
import { Entity } from './Entity';

export class AmbientLight extends Entity {
    public constructor(intensity: number) {
        super();
        
        const light = new ThreeAmbientLight(0xFFFFFF, intensity);

        this.addComponent(light);
    }
}
