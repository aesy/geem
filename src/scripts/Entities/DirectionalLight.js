import Entity from './Entity';
import { DirectionalLight as ThreeDirectionalLight } from 'three';

export default class DirectionalLight extends Entity {
    constructor(x, y, z, intensity) {
        super();

        const light = new ThreeDirectionalLight(0xFFFFFF, intensity);
        light.castShadow = true;
        light.shadow.mapSize.set(2048, 2048);
        light.shadow.camera.left = -300;
        light.shadow.camera.right = 300;
        light.shadow.camera.top = 300;
        light.shadow.camera.bottom = -300;
        light.shadow.camera.far = 3500;
        light.shadow.bias = -0.0001;
        light.position.set(x, y, z);

        this.addComponent(light);
    }
}