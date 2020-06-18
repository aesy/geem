import { Entity } from '../Entities/Entity';
import { System } from './System';
import { CameraFollow } from '../Components/CameraFollow';
import { Game } from '../Game/Game';

export class CameraFollowSystem extends System {
    // public appliesTo(entity: Entity): boolean {
    //     return entity.hasComponents(CameraFollow, Object3D);
    // }

    public update(dt: number, entities: Entity[], game: Game): void {
        for (const entity of entities) {
            // const object = entity.getComponent(Object3D);
            // const vector = game.getActiveCamera().getWorldDirection(new Vector3());
            // game.getActiveCamera().position.copy(object.position.clone().sub(vector.multiplyScalar(10)));
            // game.controls.target.copy(object.position);
        }
    }
}
