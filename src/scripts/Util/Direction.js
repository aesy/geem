export const Direction = {
    LEFT: { x: -1, y: 0, z: 0 },
    RIGHT: { x: 1, y: 0, z: 0 },
    BOTTOM: { x: 0, y: -1, z: 0 },
    TOP: { x: 0, y: 1, z: 0 },
    BACK: { x: 0, y: 0, z: -1 },
    FRONT: { x: 0, y: 0, z: 1 },

    all() {
        return [
            Direction.LEFT, Direction.RIGHT, Direction.BOTTOM, Direction.TOP, Direction.BACK, Direction.FRONT
        ];
    }
};
