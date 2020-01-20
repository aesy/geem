import { Object3D } from 'three';
import System from './System';
import Rotate from '../Components/Rotate';

export default class RotateSystem extends System {
    constructor() {
        super();
    }

    appliesTo(entity) {
        return entity.hasComponents(Object3D, Rotate);
    }

    update(dt, entities) {
        for (const entity of entities) {
            const rotation = entity.getComponent(Rotate);
            const object = entity.getComponent(Object3D);

            object.rotation.x += rotation.x * dt;
            object.rotation.y += rotation.y * dt;
            object.rotation.z += rotation.z * dt;
        }
    }
}
