import { BlockType } from './Block';
import { CullingChunkMesher } from './CullingChunkMesher';
import { BorrealForestChunkGenerator } from './BorrealForestChunkGenerator';

const blockTypes = [
    BlockType.DIRT,
    BlockType.DRY_DIRT,
    BlockType.WATER,
    BlockType.SAND,
    BlockType.STONE,
    BlockType.MOSSY_STONE,
    BlockType.SNOW,
    BlockType.TREE,
    BlockType.LEAVES,
    BlockType.MOSS,
    BlockType.SMALL_STONE,
    BlockType.TWIG,
];

export const DEFAULT_CHUNK_MESHER = new CullingChunkMesher(blockTypes);
export const DEFAULT_CHUNK_GENERATOR = new BorrealForestChunkGenerator();
