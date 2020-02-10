import { Object3D, Vector3 } from 'three';
import { Floaty } from '../Components/Floaty';
import { Entity } from '../Entities/Entity';
import { System } from './System';
import { CameraFollow } from '../Components/CameraFollow';
import { Game } from '../Game/Game';

export class CameraFollowSystem extends System {
    public appliesTo(entity: Entity): boolean {
        return entity.hasComponents(CameraFollow, Object3D);
    }

    public update(dt: number, entities: Entity[], game: Game): void {
        for (const entity of entities) {
            const object = entity.getComponent(Object3D);
            const vector = game.camera.getWorldDirection(new Vector3());
            game.camera.position.copy(object.position.clone().sub(vector.multiplyScalar(10)));
            game.controls.target.copy(object.position);
        }
    }
}
