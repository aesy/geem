import { Object3D, Vector3 } from 'three';
import { Physical } from '../Components/Physical';
import { Entity } from '../Entities/Entity';
import { System } from './System';
import { Game } from '../Game/Game';
import { World } from '../WorldGen/World';
import { BlockUtils } from '../WorldGen/Block';

export class GravitySystem extends System {
    public constructor(private readonly world: World) {
        super();
    }

    public appliesTo(entity: Entity): boolean {
        return entity.hasComponents(Physical, Object3D);
    }

    public update(dt: number, entities: Entity[], game: Game): void {
        for (const entity of entities) {
            const object = entity.getComponent(Object3D);
            const weight = entity.getComponent(Physical).value;
            const blockRelative = {
                x: Math.round(object.position.x),
                y: Math.round(object.position.y - 1),
                z: Math.round(object.position.z),
            }

            const block = this.world.getBlock(blockRelative);
                        
            if (BlockUtils.isOpaque(block)) {
                // object.position.z += 10 * dt;
                return;
            } else {
                object.position.y -= weight * dt;
            }

            
        }
    }
}
