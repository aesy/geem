import { Coordinate3 } from '../Util/Math';
import { ArchipelagoChunkGenerator } from '../WorldGen/ArchipelagoChunkGenerator';
import { Chunk, ChunkData, ChunkGenerator } from '../WorldGen/Chunk';

const chunkGenerator: ChunkGenerator = new ArchipelagoChunkGenerator();

onmessage = (event: MessageEvent): void => {
    const { x, y, z }: Coordinate3 = event.data;
    const chunkData: ChunkData = event.data.chunkData;

    console.log(`Creating chunk data: x: ${ x }, y: ${ y }, z: ${ z }`);

    const chunk = new Chunk({ x, y, z }, null, chunkData);
    chunkGenerator.generateChunk(chunk);

    (self as unknown as BroadcastChannel)
        .postMessage({ x, y, z, chunkData: chunk.data });
};
