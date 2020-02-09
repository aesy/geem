import { Coordinate3 } from './Math';

export class Direction {
    private constructor() {}

    public static readonly LEFT: Coordinate3 = { x: -1, y: 0, z: 0 };
    public static readonly RIGHT: Coordinate3 = { x: 1, y: 0, z: 0 };
    public static readonly BOTTOM: Coordinate3 = { x: 0, y: -1, z: 0 };
    public static readonly TOP: Coordinate3 = { x: 0, y: 1, z: 0 };
    public static readonly BACK: Coordinate3 = { x: 0, y: 0, z: -1 };
    public static readonly FRONT: Coordinate3 = { x: 0, y: 0, z: 1 };

    public static all(): Coordinate3[] {
        return [
            Direction.LEFT, Direction.RIGHT, Direction.BOTTOM, Direction.TOP, Direction.BACK, Direction.FRONT
        ];
    }
}
