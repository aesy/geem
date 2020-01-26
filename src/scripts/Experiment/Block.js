import { Direction } from './Direction';

export const Block = {
    Type: {
        AIR: 0,
        DIRT: 1,
        WATER: 2
    },

    isOpaque(block) {
        return block.type === Block.Type.DIRT;
    },

    getTextureIndex(block, direction) {
        switch (block.type) {
            case Block.Type.DIRT:
                if (direction === Direction.TOP) {
                    return 0;
                } else {
                    return 2;
                }
            case Block.Type.WATER:
                return 3;
            default:
                throw 'Unknown or invalid block type';
        }
    }
};
