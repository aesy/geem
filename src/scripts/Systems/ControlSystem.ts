import { Object3D, Vector3, Box3 } from 'three';
import { Entity } from '../Entities/Entity';
import { System } from './System';
import { Game } from '../Game/Game';
import { Controlable } from '../Components/Controlable';
import { Movable } from '../Components/Movable';
import { BlockUtils } from '../WorldGen/Block';
import { World } from '../WorldGen/World';

export class ControlSystem extends System {
    public constructor(private readonly world: World) {
        super();
    }

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
        return entity.hasComponents(Controlable, Movable, Object3D);
    }
    
    public update(dt: number, entities: Entity[], game: Game): void {
        const vector = game.camera.getWorldDirection(new Vector3());
        vector.y = 0;
        
        for (const entity of entities) {
            const object = entity.getComponent(Object3D);
            const velocity = entity.getComponent(Movable).velocity;
            const direction = new Vector3();
            
            const boundingBox = new Box3().setFromObject(object);
            const size = boundingBox.getSize(new Vector3());

            const positionUnder = {
                x: Math.floor(object.position.x),
                y: Math.floor(object.position.y - (size.y / 2) - 1),
                z: Math.floor(object.position.z)
            };
            
            const block = this.world.getBlock(positionUnder);
            
            velocity.x = 0;
            velocity.z = 0;
            
            if (this.keys.has('w')) {
                direction.add(vector);
            }
            if (this.keys.has('s')) {
                direction.add(vector).negate();  
            } 
            if (this.keys.has('a')) {
                direction.add(vector.clone().applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2));
            } 
            if (this.keys.has('d')) {
                direction.add(vector.clone().applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2).negate());
            } 

            direction.normalize().multiplyScalar(10);

            if (BlockUtils.isOpaque(block) && boundingBox.min.y === positionUnder.y + 1) {
                if (this.keys.has('space')) {
                    direction.y = 10;
                }
            }

            velocity.add(direction);
        }
    }
}
