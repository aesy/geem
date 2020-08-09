import { Coordinate3 } from '../Util/Math';

export enum BlockType {
    AIR,
    DIRT,
    MOSSY_DIRT,
    DRY_DIRT,
    WATER,
    SAND,
    STONE,
    MOSSY_STONE,
    SNOW,
    TREE,
    LEAVES,
    MOSS,
    SMALL_STONE,
    TWIG,
    GRASS,
    BLUEBERRIES,
    LINGONBERRIES,
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
            BlockType.MOSSY_DIRT,
            BlockType.DRY_DIRT,
            BlockType.SAND,
            BlockType.STONE,
            BlockType.SNOW,
            BlockType.TREE,
            BlockType.MOSSY_STONE,
        ].includes(block.type);
    }
}
