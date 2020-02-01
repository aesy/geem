import { Direction } from '../Util/Direction';

export const Block = {
    Type: {
        AIR: 0,
        DIRT: 1,
        WATER: 2,
        SAND: 3,
        STONE: 4,
        SNOW: 5,
    },

    isOpaque(block) {
        return [ Block.Type.DIRT, Block.Type.SAND, Block.Type.STONE, Block.Type.SNOW ].includes(block.type);
    },

    getTextureIndex(block, direction) {
        switch (block.type) {
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
};
