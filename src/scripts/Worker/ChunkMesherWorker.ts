import { Coordinate3 } from '../Util/Math';
import { Chunk, ChunkData } from '../WorldGen/Chunk';
import { DEFAULT_CHUNK_MESHER } from '../WorldGen/Defaults';

onmessage = (event: MessageEvent): void => {
    const { x, y, z }: Coordinate3 = event.data;
    const chunkData: ChunkData = event.data.chunkData;

    console.log(`Creating chunk mesh: x: ${ x }, y: ${ y }, z: ${ z }`);

    const chunk = new Chunk({ x, y, z }, null, chunkData);
    const meshData = DEFAULT_CHUNK_MESHER.createMesh(chunk);

    (self as unknown as BroadcastChannel)
        .postMessage({ x, y, z, meshData });
};
