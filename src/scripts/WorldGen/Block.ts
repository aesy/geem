import World from './World';
import { Direction } from '../Util/Direction';

export default class Block {
    static Type = {
        AIR: 0,
        DIRT: 1,
        WATER: 2,
        SAND: 3,
        STONE: 4,
        SNOW: 5,
        TREE: 6,
        LEAVES: 7
    };

    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly z: number,
        public readonly type: number,
        private readonly world: World
    ) {}

    getAdjacentBlock(direction: { x: number; y: number; z: number }): Block {
        return this.world.getBlock(this.x + direction.x, this.y + direction.y, this.z + direction.z);
    }

    getTextureIndex(direction: { x: number; y: number; z: number }): number {
        if (this.type === Block.Type.DIRT && this.getAdjacentBlock(Direction.TOP).type === Block.Type.DIRT) {
            return 1;
        }

        switch (this.type) {
            case Block.Type.STONE:
                return 5;
            case Block.Type.SNOW:
                return 6;
            case Block.Type.TREE:
                return 7;
            case Block.Type.LEAVES:
                return 8;
            case Block.Type.DIRT:
                if (direction === Direction.TOP) {
                    return 0;
                } else {
                    return 2;
                }
            case Block.Type.WATER:
                return 3;
            case Block.Type.SAND:
                return 4;
            default:
                throw 'Unknown or invalid block type';
        }
    }

    static isOpaque(block: Block): boolean {
        return [
            Block.Type.DIRT,
            Block.Type.SAND,
            Block.Type.STONE,
            Block.Type.SNOW,
            Block.Type.TREE
        ].includes(block.type);
    }
}
