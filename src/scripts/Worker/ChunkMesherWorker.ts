import { Coordinate3 } from '../Util/Math';
import { Constructor } from '../Util/Type';
import { Chunk, ChunkData, ChunkMesher } from '../WorldGen/Chunk';
import { CullingChunkMesher } from '../WorldGen/CullingChunkMesher';
import { DEFAULT_CHUNK_MESHER } from '../WorldGen/Defaults';
import { BlockType } from '../WorldGen/Block';

const mesher: ChunkMesher = new CullingChunkMesher([
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
]);

const chunkMeshers: { [ key: string ]: Constructor<ChunkMesher> } = {
    [ CullingChunkMesher.name ]: CullingChunkMesher
};

onmessage = (event: MessageEvent): void => {
    const { x, y, z }: Coordinate3 = event.data;
    const chunkData: ChunkData = event.data.chunkData;
    const MesherImpl = chunkMeshers[ event.data.impl ];
    const args = event.data.args;
    let mesher: ChunkMesher;

    if (MesherImpl) {
        mesher = new MesherImpl(...args);
    } else {
        console.warn('Mesher implementation either not specified or unrecognized, using default mesher');
        mesher = DEFAULT_CHUNK_MESHER;
    }

    const chunk = new Chunk({ x, y, z }, null, chunkData);
    const meshData = mesher.createMesh(chunk);

    (self as unknown as BroadcastChannel)
        .postMessage({ x, y, z, meshData });
};
