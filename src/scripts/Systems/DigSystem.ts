import { Raycaster, Vector2, Vector3 } from 'three';
import { Entity } from '../Entities/Entity';
import { BlockRemoved } from '../Event/BlockRemoved';
import { Game } from '../Game/Game';
import { Coordinate3 } from '../Util/Math';
import { BlockType, BlockUtils } from '../WorldGen/Block';
import { World } from '../WorldGen/World';
import { System } from './System';

function floor(position: Coordinate3): Coordinate3 {
    return {
        x: Math.floor(position.x),
        y: Math.floor(position.y),
        z: Math.floor(position.z)
    };
}

export class DigSystem extends System {
    private clicked: Vector2 | null = null;

    public constructor(
        private readonly world: World
    ) {
        super();

        addEventListener('mousedown', this.onMouseClick.bind(this));
    }

    public update(dt: number, entities: Entity[], game: Game): void {
        if (!this.clicked) {
            return;
        }

        const raycaster = new Raycaster();
        raycaster.set(game.pointerControls.getObject().position, game.pointerControls.getDirection(new Vector3()));
        // raycaster.setFromCamera(this.clicked, game.camera);
        const intersection = this.raycast(raycaster.ray.origin, raycaster.ray.direction);

        if (intersection) {
            this.world.setBlock(intersection, { type: BlockType.AIR });
            game.events.emit(new BlockRemoved(intersection));
        }

        this.clicked = null;
    }

    private onMouseClick(event: MouseEvent): void {
        // Skip if not a right click
        if (event.button !== 2) {
            return;
        }

        const { innerHeight, innerWidth } = window;
        const x = (event.clientX / innerWidth) * 2 - 1;
        const y = -(event.clientY / innerHeight) * 2 + 1;

        this.clicked = new Vector2(x, y);
    }

    // http://www.cse.chalmers.se/edu/year/2010/course/TDA361/grid.pdf
    private raycast(start: Coordinate3, direction: Coordinate3): Coordinate3 | null {
        const limit = 20;
        let length = 0;
        const current = Object.assign({}, start);

        while (length < limit) {
            const normalized = floor(current);
            const block = this.world.getBlock(normalized);

            if (BlockUtils.isOpaque(block)) {
                return normalized;
            }

            // TODO uuughh inefficient as fuck
            current.x += direction.x * 0.1;
            current.y += direction.y * 0.1;
            current.z += direction.z * 0.1;
            length += Math.sqrt(Math.pow(direction.x, 2) + Math.pow(direction.y, 2) + Math.pow(direction.z, 2)) * 0.1;
        }

        return null;
    }
}
