import { Object3D, Vector3 } from 'three';
import { Movable } from '../Components/Movable';
import { Entity } from '../Entities/Entity';
import { System } from './System';
import { Game } from '../Game/Game';
import { World } from '../WorldGen/World';

export class VelocitySystem extends System {
    public constructor(private readonly world: World) {
        super();
    }

    public appliesTo(entity: Entity): boolean {
        return entity.hasComponents(Movable, Object3D);
    }

    public update(dt: number, entities: Entity[], game: Game): void {
        for (const entity of entities) {
            const object = entity.getComponent(Object3D);
            const velocity = entity.getComponent(Movable).velocity;
            
            object.position.add(velocity.clone().multiplyScalar(dt)); 
        }
    }
}
