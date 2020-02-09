import { Coordinate3 } from '../Util/Math';
import { BlockType } from '../WorldGen/Block';
import { Chunk, ChunkData, ChunkMesher } from '../WorldGen/Chunk';
import { CullingChunkMesher } from '../WorldGen/CullingChunkMesher';

const mesher: ChunkMesher = new CullingChunkMesher([
    BlockType.DIRT,
    BlockType.WATER,
    BlockType.SAND,
    BlockType.STONE,
    BlockType.SNOW,
    BlockType.TREE,
    BlockType.LEAVES
]);

onmessage = (event: MessageEvent): void => {
    const { x, y, z }: Coordinate3 = event.data;
    const chunkData: ChunkData = event.data.chunkData;

    console.log(`Creating chunk mesh: x: ${ x }, y: ${ y }, z: ${ z }`);

    const chunk = new Chunk({ x, y, z }, null, chunkData);
    const meshData = mesher.createMesh(chunk);

    (self as unknown as BroadcastChannel)
        .postMessage({ x, y, z, meshData });
};
