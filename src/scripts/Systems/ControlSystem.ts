import { Object3D, Vector3 } from 'three';
import { Entity } from '../Entities/Entity';
import { System } from './System';
import { Game } from '../Game/Game';
import { Controlable } from '../Components/Controlable';

export class ControlSystem extends System {
    private readonly keys = new Set<string>();

    private onKeyDown(event: KeyboardEvent): void {
        if (event.keyCode === 87) {
            this.keys.add('w');
        } else if (event.keyCode === 83) {
            this.keys.add('s');
        } else if (event.keyCode === 65) {
            this.keys.add('a');
        } else if (event.keyCode === 68) {
            this.keys.add('d');
        } else if (event.keyCode === 32) {
            this.keys.add('space');
        }
    }

    private onKeyUp(event: KeyboardEvent): void {
        if (event.keyCode === 87) {
            this.keys.delete('w');
        } else if (event.keyCode === 83) {
            this.keys.delete('s');
        } else if (event.keyCode === 65) {
            this.keys.delete('a');
        } else if (event.keyCode === 68) {
            this.keys.delete('d');
        } else if (event.keyCode === 32) {
            this.keys.delete('space');
        }
    }

    public initialize(game: Game): void {
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    public appliesTo(entity: Entity): boolean {
        return entity.hasComponents(Controlable, Object3D);
    }
    
    public update(dt: number, entities: Entity[], game: Game): void {
        const vector = game.camera.getWorldDirection(new Vector3());

        for (const entity of entities) {
            const object = entity.getComponent(Object3D);
            if (this.keys.has('w')) {
                object.position.z += vector.z * dt * 10;
                object.position.x += vector.x * dt * 10;
            }
            if (this.keys.has('s')) {
                object.position.z -= vector.z * dt * 5;
                object.position.x -= vector.x * dt * 5;            
            }
            if (this.keys.has('a')) {
                object.position.z += vector.clone().applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2).z * dt * 10;
                object.position.x += vector.clone().applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2).x * dt * 10;
            }
            if (this.keys.has('d')) {
                object.position.z -= vector.clone().applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2).z * dt * 10;
                object.position.x -= vector.clone().applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2).x * dt * 10;
            }
            if (this.keys.has('space')) {
                object.position.y += 10 * dt;
            }
    
        }
    }
}
