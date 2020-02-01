import { Direction } from '../Util/Direction';

export default class Block {
    static Type = {
        AIR: 0,
        DIRT: 1,
        WATER: 2,
        SAND: 3,
        STONE: 4,
        SNOW: 5,
    };

    constructor(x, y, z, type, world) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.type = type;
        this.world = world;
    }

    getAdjacentBlock(direction) {
        return this.world.getBlock(this.x + direction.x, this.y + direction.y, this.z + direction.z);
    }

    getTextureIndex(direction) {
        if (this.type === Block.Type.DIRT && this.getAdjacentBlock(Direction.TOP).type === Block.Type.DIRT) {
            return 1;
        }

        switch (this.type) {
            case Block.Type.STONE:
                    return 5;
            case Block.Type.SNOW:
                    return 6;
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

    static isOpaque(block) {
        return [
            Block.Type.DIRT,
            Block.Type.SAND,
            Block.Type.STONE,
            Block.Type.SNOW
        ].includes(block.type);
    }
}
