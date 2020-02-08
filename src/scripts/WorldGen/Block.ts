import { Coordinate3 } from '../Util/Math';

export enum BlockType {
    AIR,
    DIRT,
    WATER,
    SAND,
    STONE,
    SNOW,
    TREE,
    LEAVES
}

export interface Block {
    type: BlockType;
}

export type PositionedBlock = Coordinate3 & Block;

export class BlockUtils {
    private constructor() {}

    public static isOpaque(block: Block): boolean {
        return [
            BlockType.DIRT,
            BlockType.SAND,
            BlockType.STONE,
            BlockType.SNOW,
            BlockType.TREE
        ].includes(block.type);
    }
}
