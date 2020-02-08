import { Object3D } from 'three';
import Rotate from '../Components/Rotate';
import Entity from '../Entities/Entity';
import System from './System';

export default class RotateSystem extends System {
    appliesTo(entity: Entity): boolean {
        return entity.hasComponents(Object3D, Rotate);
    }

    update(dt: number, entities: Entity[]): void {
        for (const entity of entities) {
            const rotation = entity.getComponent(Rotate);
            const object = entity.getComponent(Object3D);

            object.rotation.x += rotation.x * dt;
            object.rotation.y += rotation.y * dt;
            object.rotation.z += rotation.z * dt;
        }
    }
}
