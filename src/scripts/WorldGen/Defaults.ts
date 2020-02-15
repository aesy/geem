import { ArchipelagoChunkGenerator } from './ArchipelagoChunkGenerator';
import { BlockType } from './Block';
import { CullingChunkMesher } from './CullingChunkMesher';

const blockTypes = [
    BlockType.DIRT,
    BlockType.SAND,
    BlockType.WATER,
    BlockType.TREE,
    BlockType.LEAVES
];

export const DEFAULT_CHUNK_MESHER = new CullingChunkMesher(blockTypes);
export const DEFAULT_CHUNK_GENERATOR = new ArchipelagoChunkGenerator();
