import { Coordinate3 } from '../Util/Math';
import { Constructor } from '../Util/Type';
import { ArchipelagoChunkGenerator } from '../WorldGen/ArchipelagoChunkGenerator';
import { BorrealForestChunkGenerator } from '../WorldGen/BorrealForestChunkGenerator';
import { Chunk, ChunkData, ChunkGenerator } from '../WorldGen/Chunk';
import { DEFAULT_CHUNK_GENERATOR } from '../WorldGen/Defaults';

const chunkGenerators: { [ key: string ]: Constructor<ChunkGenerator> } = {
    [ ArchipelagoChunkGenerator.name ]: ArchipelagoChunkGenerator,
    [ BorrealForestChunkGenerator.name ]: BorrealForestChunkGenerator
};

onmessage = (event: MessageEvent): void => {
    const { x, y, z }: Coordinate3 = event.data;
    const chunkData: ChunkData = event.data.chunkData;
    const GeneratorImpl = chunkGenerators[ event.data.impl ];
    const args: any[] = event.data.args || [];
    let generator: ChunkGenerator;

    if (GeneratorImpl) {
        generator = new GeneratorImpl(...args);
    } else {
        console.warn('Generator implementation either not specified or unrecognized, using default generator');
        generator = DEFAULT_CHUNK_GENERATOR;
    }

    const chunk = new Chunk({ x, y, z }, null, chunkData);
    generator.generateChunk(chunk);

    (self as unknown as BroadcastChannel)
        .postMessage({ x, y, z, chunkData: chunk.data });
};
