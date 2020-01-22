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

            if (floaty.currentOffset <= Math.min(0, floaty.maxOffset)) {
                floaty.direction = 1;
            } else if (floaty.currentOffset >= Math.max(0, floaty.maxOffset)) {
                floaty.direction = -1;
            }

            const movement = floaty.direction * floaty.speed * dt;
            floaty.currentOffset += movement;
            object.position.y += movement;
        }
    }
}
