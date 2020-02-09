import { Coordinate3 } from './Math';

export class Direction {
    private constructor() {}

    public static LEFT: Coordinate3 = { x: -1, y: 0, z: 0 };
    public static RIGHT: Coordinate3 = { x: 1, y: 0, z: 0 };
    public static BOTTOM: Coordinate3 = { x: 0, y: -1, z: 0 };
    public static TOP: Coordinate3 = { x: 0, y: 1, z: 0 };
    public static BACK: Coordinate3 = { x: 0, y: 0, z: -1 };
    public static FRONT: Coordinate3 = { x: 0, y: 0, z: 1 };

    public static all(): Coordinate3[] {
        return [
            Direction.LEFT, Direction.RIGHT, Direction.BOTTOM, Direction.TOP, Direction.BACK, Direction.FRONT
        ];
    }
}
