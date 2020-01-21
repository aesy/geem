import { Object3D } from 'three';
import Floaty from '../Components/Floaty';
import System from './System';

export default class FloatSystem extends System {
    appliesTo(entity) {
        return entity.hasComponents(Floaty, Object3D);
    }

    update(dt, entities) {
        for (const entity of entities) {
            const floaty = entity.getComponent(Floaty);
            const object = entity.getComponent(Object3D);

            floaty.currentOffset += floaty.speed * dt;
            object.position.y += Math.sin(floaty.currentOffset) * floaty.maxOffset / 2 * dt;
        }
    }
}
