import { Object3D } from 'three';
import { Floaty } from '../Components/Floaty';
import { Entity } from '../Entities/Entity';
import { System } from './System';

export class FloatSystem extends System {
    public appliesTo(entity: Entity): boolean {
        return entity.hasComponents(Floaty, Object3D);
    }

    public update(dt: number, entities: Entity[]): void {
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
