import { Object3D, Vector3 } from 'three';
import { Floaty } from '../Components/Floaty';
import { Entity } from '../Entities/Entity';
import { System } from './System';
import { HasCamera } from '../Components/HasCamera';
import { Game } from '../Game/Game';
import { Player } from '../Entities/Player';

export class CameraSystem extends System {
    private firstPerson = true;


    public appliesTo(entity: Entity): boolean {
        return entity instanceof Player;
    }

    public initialize(game: Game): void {
        document.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    private onKeyDown(event: KeyboardEvent): void {
        // F
        if (event.keyCode === 70) {
            this.firstPerson = !this.firstPerson;
        }
    }

    public update(dt: number, entities: Entity[], game: Game): void {
        for (const entity of entities) {
            const object = entity.getComponent(Object3D);
            const vector = game.camera.getWorldDirection(new Vector3());
            if (this.firstPerson) {
                game.pointerControls.getObject().position.copy(object.position);
            } else {
                game.pointerControls.getObject().position.copy(object.position.clone().sub(vector.multiplyScalar(10)));
            }
        }
    }
}
