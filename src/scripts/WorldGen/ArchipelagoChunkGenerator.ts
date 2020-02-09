// @ts-ignore
import PoissonDiskSampling from 'poisson-disk-sampling';
import { makeNoise2D } from 'open-simplex-noise';
import { BlockType, PositionedBlock } from './Block';
import { Chunk, ChunkGenerator, ChunkUtils } from './Chunk';

const noise = makeNoise2D(Math.random() * Number.MAX_SAFE_INTEGER);
const amplitude = 15;
const frequency = 1.5;

const oakTree: PositionedBlock[] = [
    { x: 0, y: 0, z: 0, type: BlockType.TREE },
    { x: 0, y: 1, z: 0, type: BlockType.TREE },
    { x: 0, y: 2, z: 0, type: BlockType.TREE },
    { x: 0, y: 3, z: 0, type: BlockType.TREE },
    { x: -1, y: 4, z: -1, type: BlockType.LEAVES },
    { x: -1, y: 4, z: 0, type: BlockType.LEAVES },
    { x: -1, y: 4, z: 1, type: BlockType.LEAVES },
    { x: 0, y: 4, z: -1, type: BlockType.LEAVES },
    { x: 0, y: 4, z: 0, type: BlockType.TREE },
    { x: 0, y: 4, z: 1, type: BlockType.LEAVES },
    { x: 1, y: 4, z: -1, type: BlockType.LEAVES },
    { x: 1, y: 4, z: 0, type: BlockType.LEAVES },
    { x: 1, y: 4, z: 1, type: BlockType.LEAVES },
    { x: -2, y: 5, z: -2, type: BlockType.LEAVES },
    { x: -2, y: 5, z: -1, type: BlockType.LEAVES },
    { x: -2, y: 5, z: 0, type: BlockType.LEAVES },
    { x: -2, y: 5, z: 1, type: BlockType.LEAVES },
    { x: -2, y: 5, z: 2, type: BlockType.LEAVES },
    { x: -1, y: 5, z: -2, type: BlockType.LEAVES },
    { x: -1, y: 5, z: -1, type: BlockType.LEAVES },
    { x: -1, y: 5, z: 0, type: BlockType.LEAVES },
    { x: -1, y: 5, z: 1, type: BlockType.LEAVES },
    { x: -1, y: 5, z: 2, type: BlockType.LEAVES },
    { x: 0, y: 5, z: -2, type: BlockType.LEAVES },
    { x: 0, y: 5, z: -1, type: BlockType.LEAVES },
    { x: 0, y: 5, z: 0, type: BlockType.LEAVES },
    { x: 0, y: 5, z: 1, type: BlockType.LEAVES },
    { x: 0, y: 5, z: 2, type: BlockType.LEAVES },
    { x: 1, y: 5, z: -2, type: BlockType.LEAVES },
    { x: 1, y: 5, z: -1, type: BlockType.LEAVES },
    { x: 1, y: 5, z: 0, type: BlockType.LEAVES },
    { x: 1, y: 5, z: 1, type: BlockType.LEAVES },
    { x: 1, y: 5, z: 2, type: BlockType.LEAVES },
    { x: 2, y: 5, z: -2, type: BlockType.LEAVES },
    { x: 2, y: 5, z: -1, type: BlockType.LEAVES },
    { x: 2, y: 5, z: 0, type: BlockType.LEAVES },
    { x: 2, y: 5, z: 1, type: BlockType.LEAVES },
    { x: 2, y: 5, z: 2, type: BlockType.LEAVES },
    { x: -1, y: 6, z: -1, type: BlockType.LEAVES },
    { x: -1, y: 6, z: 0, type: BlockType.LEAVES },
    { x: -1, y: 6, z: 1, type: BlockType.LEAVES },
    { x: 0, y: 6, z: -1, type: BlockType.LEAVES },
    { x: 0, y: 6, z: 0, type: BlockType.LEAVES },
    { x: 0, y: 6, z: 1, type: BlockType.LEAVES },
    { x: 1, y: 6, z: -1, type: BlockType.LEAVES },
    { x: 1, y: 6, z: 0, type: BlockType.LEAVES },
    { x: 1, y: 6, z: 1, type: BlockType.LEAVES }
];

export class ArchipelagoChunkGenerator implements ChunkGenerator {
    public generateChunk(chunk: Chunk): void {
        ArchipelagoChunkGenerator.generateTerrain(chunk);
        ArchipelagoChunkGenerator.generateTrees(chunk);
    }

    private static generateTerrain(chunk: Chunk): void {
        const xOffset = chunk.x * Chunk.SIZE;
        const yOffset = chunk.y * Chunk.SIZE;
        const zOffset = chunk.z * Chunk.SIZE;

        if (yOffset > 2 * amplitude) {
            // We are so far above the ground that we can say for certain all blocks will be air
            return;
        }

        for (let blockX = 0; blockX < Chunk.SIZE; blockX++) {
            for (let blockY = 0; blockY < Chunk.SIZE; blockY++) {
                for (let blockZ = 0; blockZ < Chunk.SIZE; blockZ++) {
                    const worldX = (blockX + xOffset);
                    const worldY = (blockY + yOffset);
                    const worldZ = (blockZ + zOffset);
                    const noiseX = worldX / 100;
                    const noiseY = worldZ / 100;
                    const layer1 = noise(noiseX * frequency, noiseY * frequency);
                    const layer2 = 0.5 * noise(noiseX * frequency * 2, noiseY * frequency * 2);
                    const layer3 = 0.25 * noise(noiseX * frequency * 4, noiseY * frequency * 4);
                    const limit = amplitude * ((layer1 + layer2 + layer3) + 1) / 2;
                    const isGround = worldY <= Math.round(limit);

                    let type;

                    if (isGround && worldY > 30) {
                        type = BlockType.SNOW;
                    } else if (isGround && worldY > 20) {
                        type = BlockType.STONE;
                    } else if (isGround && worldY > 11) {
                        type = BlockType.DIRT;
                    } else if (isGround && worldY <= 11) {
                        type = BlockType.SAND;
                    } else if (worldY <= 10) {
                        type = BlockType.WATER;
                    } else {
                        continue;
                    }

                    chunk.setBlock({ x: blockX, y: blockY, z: blockZ }, { type });
                }
            }
        }
    }

    private static generateTrees(chunk: Chunk): void {
        const sampler = new PoissonDiskSampling([ Chunk.SIZE - 1, Chunk.SIZE - 1 ], 6, 1000, 30);
        const points = sampler.fill();

        for (const point of points) {
            const x = Math.floor(point[ 0 ]);
            const z = Math.floor(point[ 1 ]);

            for (let y = 0; y < Chunk.SIZE; y++) {
                const pos = { x, y, z };
                const block = chunk.getBlock(pos);

                if (y === 0) {
                    continue;
                }

                const previous = chunk.getBlock({ x, y: y - 1, z });

                if (block.type === BlockType.AIR && previous.type === BlockType.DIRT) {
                    ChunkUtils.applyTemplate(chunk, pos, oakTree);
                    break;
                }
            }
        }
    }
}
