import { Physical } from '../Components/Physical';
import { Entity } from '../Entities/Entity';
import { System } from './System';
import { Game } from '../Game/Game';
import { Movable } from '../Components/Movable';

export class GravitySystem extends System {
    public constructor() {
        super();
    }

    public appliesTo(entity: Entity): boolean {
        return entity.hasComponents(Physical, Movable);
    }

    public update(dt: number, entities: Entity[], game: Game): void {
        for (const entity of entities) {
            const weight = entity.getComponent(Physical).value;
            const velocity = entity.getComponent(Movable).velocity;
            // const gravity = new Vector3(0, -1, 0);

            // velocity.add(gravity.multiplyScalar(weight * dt));
        }
    }
}
