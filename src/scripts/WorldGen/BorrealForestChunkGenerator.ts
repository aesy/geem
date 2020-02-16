// @ts-ignore
import PoissonDiskSampling from 'poisson-disk-sampling';
import { makeNoise2D, makeNoise3D } from 'open-simplex-noise';
import { BlockType, PositionedBlock } from './Block';
import { Chunk, ChunkGenerator, ChunkUtils } from './Chunk';
import MersenneTwister from 'mersenne-twister';

const noise = makeNoise2D(123);
const noise3d = makeNoise3D(123);
const amplitude = 40;
const frequency = .5;

const fallenPineTree: PositionedBlock[] = [
    { x: 0, y: 0, z: 0, type: BlockType.DIRT },
    { x: 0, y: 1, z: 0, type: BlockType.DIRT },
    { x: 0, y: 2, z: 0, type: BlockType.DIRT },
    { x: 0, y: 3, z: 0, type: BlockType.DIRT },
    { x: -1, y: 4, z: 0, type: BlockType.DIRT },
    { x: 0, y: 0, z: -1, type: BlockType.DIRT },
    { x: 0, y: 1, z: -1, type: BlockType.DIRT },
    { x: 0, y: 2, z: -1, type: BlockType.DIRT },
    { x: 0, y: 3, z: -1, type: BlockType.DIRT },
    { x: -1, y: 4, z: -1, type: BlockType.DIRT },
    { x: 0, y: 0, z: 1, type: BlockType.DIRT },
    { x: 0, y: 1, z: 1, type: BlockType.DIRT },
    { x: 0, y: 2, z: 1, type: BlockType.DIRT },
    { x: 0, y: 3, z: 1, type: BlockType.DIRT },
    { x: -1, y: 4, z: 1, type: BlockType.DIRT },
    { x: -1, y: 0, z: 2, type: BlockType.DIRT },
    { x: -1, y: 1, z: 2, type: BlockType.DIRT },
    { x: -1, y: 2, z: 2, type: BlockType.DIRT },
    { x: -1, y: 3, z: 2, type: BlockType.DIRT },
    { x: -1, y: 0, z: -2, type: BlockType.DIRT },
    { x: -1, y: 1, z: -2, type: BlockType.DIRT },
    { x: -1, y: 2, z: -2, type: BlockType.DIRT },
    { x: -1, y: 3, z: -2, type: BlockType.DIRT },
    { x: -1, y: 0, z: 0, type: BlockType.DIRT },
    { x: -1, y: 0, z: 1, type: BlockType.DIRT },
    { x: -1, y: 1, z: 1, type: BlockType.DIRT },
    { x: 1, y: 1, z: 0, type: BlockType.TREE },
    { x: 2, y: 1, z: 0, type: BlockType.TREE },
    { x: 3, y: 1, z: 0, type: BlockType.TREE },
    { x: 4, y: 1, z: 0, type: BlockType.TREE },
    { x: 5, y: 1, z: 0, type: BlockType.TREE },
    { x: 6, y: 1, z: 0, type: BlockType.TREE },
    { x: 7, y: 1, z: 0, type: BlockType.TREE },
    { x: 8, y: 1, z: 0, type: BlockType.TREE },
    { x: 9, y: 1, z: 0, type: BlockType.TREE },
];

const largePineTree: PositionedBlock[] = [
    { x: 1, y: -1, z: 0, type: BlockType.DRY_DIRT },
    { x: -1, y: -1, z: 0, type: BlockType.DRY_DIRT },
    { x: 0, y: -1, z: 1, type: BlockType.DRY_DIRT },
    { x: 0, y: -1, z: -1, type: BlockType.DRY_DIRT },
    { x: 0, y: 0, z: 0, type: BlockType.TREE },
    { x: 0, y: 1, z: 0, type: BlockType.TREE },
    { x: 0, y: 2, z: 0, type: BlockType.TREE },
    { x: 0, y: 3, z: 0, type: BlockType.TREE },
    { x: 0, y: 4, z: 0, type: BlockType.TREE },
    { x: 0, y: 5, z: 0, type: BlockType.TREE },
    { x: 0, y: 6, z: 0, type: BlockType.TREE },
    { x: 0, y: 7, z: 0, type: BlockType.TREE },
    { x: 0, y: 8, z: 0, type: BlockType.TREE },
    { x: 0, y: 9, z: 0, type: BlockType.TREE },
    { x: 0, y: 10, z: 0, type: BlockType.TREE },
    { x: 0, y: 11, z: 0, type: BlockType.TREE },
    { x: 0, y: 12, z: 0, type: BlockType.TREE },
    { x: 0, y: 13, z: 0, type: BlockType.LEAVES },
    { x: 1, y: 12, z: 0, type: BlockType.LEAVES },
    { x: -1, y: 12, z: 0, type: BlockType.LEAVES },
    { x: 0, y: 12, z: 1, type: BlockType.LEAVES },
    { x: 0, y: 12, z: -1, type: BlockType.LEAVES },
    { x: 1, y: 10, z: 0, type: BlockType.LEAVES },
    { x: -1, y: 10, z: 0, type: BlockType.LEAVES },
    { x: 0, y: 10, z: 1, type: BlockType.LEAVES },
    { x: 0, y: 10, z: -1, type: BlockType.LEAVES },
    { x: 1, y: 9, z: 0, type: BlockType.LEAVES },
    { x: -1, y: 9, z: 0, type: BlockType.LEAVES },
    { x: 0, y: 9, z: 1, type: BlockType.LEAVES },
    { x: 0, y: 9, z: -1, type: BlockType.LEAVES },
    { x: 1, y: 7, z: 0, type: BlockType.LEAVES },
    { x: -1, y: 7, z: 0, type: BlockType.LEAVES },
    { x: 0, y: 7, z: 1, type: BlockType.LEAVES },
    { x: 0, y: 7, z: -1, type: BlockType.LEAVES },
    { x: 1, y: 6, z: 0, type: BlockType.LEAVES },
    { x: -1, y: 6, z: 0, type: BlockType.LEAVES },
    { x: 0, y: 6, z: 1, type: BlockType.LEAVES },
    { x: 0, y: 6, z: -1, type: BlockType.LEAVES },
    { x: 2, y: 6, z: 0, type: BlockType.LEAVES },
    { x: -2, y: 6, z: 0, type: BlockType.LEAVES },
    { x: 0, y: 6, z: 2, type: BlockType.LEAVES },
    { x: 0, y: 6, z: -2, type: BlockType.LEAVES },
    { x: 1, y: 4, z: 0, type: BlockType.LEAVES },
    { x: -1, y: 4, z: 0, type: BlockType.LEAVES },
    { x: 0, y: 4, z: 1, type: BlockType.LEAVES },
    { x: 0, y: 4, z: -1, type: BlockType.LEAVES },
    { x: 1, y: 3, z: 0, type: BlockType.LEAVES },
    { x: -1, y: 3, z: 0, type: BlockType.LEAVES },
    { x: 0, y: 3, z: 1, type: BlockType.LEAVES },
    { x: 0, y: 3, z: -1, type: BlockType.LEAVES },
    { x: 2, y: 3, z: 0, type: BlockType.LEAVES },
    { x: -2, y: 3, z: 0, type: BlockType.LEAVES },
    { x: 0, y: 3, z: 2, type: BlockType.LEAVES },
    { x: 0, y: 3, z: -2, type: BlockType.LEAVES }
];


const mediumPineTree: PositionedBlock[] = [
    { x: 1, y: -1, z: 0, type: BlockType.DRY_DIRT },
    { x: -1, y: -1, z: 0, type: BlockType.DRY_DIRT },
    { x: 0, y: -1, z: 1, type: BlockType.DRY_DIRT },
    { x: 0, y: -1, z: -1, type: BlockType.DRY_DIRT },
    { x: 0, y: 0, z: 0, type: BlockType.TREE },
    { x: 0, y: 1, z: 0, type: BlockType.TREE },
    { x: 0, y: 2, z: 0, type: BlockType.TREE },
    { x: 0, y: 3, z: 0, type: BlockType.TREE },
    { x: 0, y: 4, z: 0, type: BlockType.TREE },
    { x: 0, y: 5, z: 0, type: BlockType.TREE },
    { x: 0, y: 6, z: 0, type: BlockType.TREE },
    { x: 0, y: 7, z: 0, type: BlockType.TREE },
    { x: 0, y: 8, z: 0, type: BlockType.TREE },
    { x: 0, y: 9, z: 0, type: BlockType.TREE },
    { x: 0, y: 10, z: 0, type: BlockType.TREE },
    { x: 0, y: 11, z: 0, type: BlockType.LEAVES },
    { x: 1, y: 10, z: 0, type: BlockType.LEAVES },
    { x: -1, y: 10, z: 0, type: BlockType.LEAVES },
    { x: 0, y: 10, z: 1, type: BlockType.LEAVES },
    { x: 0, y: 10, z: -1, type: BlockType.LEAVES },
    { x: 1, y: 8, z: 0, type: BlockType.LEAVES },
    { x: -1, y: 8, z: 0, type: BlockType.LEAVES },
    { x: 0, y: 8, z: 1, type: BlockType.LEAVES },
    { x: 0, y: 8, z: -1, type: BlockType.LEAVES },
    { x: 1, y: 7, z: 0, type: BlockType.LEAVES },
    { x: -1, y: 7, z: 0, type: BlockType.LEAVES },
    { x: 0, y: 7, z: 1, type: BlockType.LEAVES },
    { x: 0, y: 7, z: -1, type: BlockType.LEAVES },
    { x: 1, y: 5, z: 0, type: BlockType.LEAVES },
    { x: -1, y: 5, z: 0, type: BlockType.LEAVES },
    { x: 0, y: 5, z: 1, type: BlockType.LEAVES },
    { x: 0, y: 5, z: -1, type: BlockType.LEAVES },
    { x: 1, y: 4, z: 0, type: BlockType.LEAVES },
    { x: -1, y: 4, z: 0, type: BlockType.LEAVES },
    { x: 0, y: 4, z: 1, type: BlockType.LEAVES },
    { x: 0, y: 4, z: -1, type: BlockType.LEAVES },
    { x: 2, y: 4, z: 0, type: BlockType.LEAVES },
    { x: -2, y: 4, z: 0, type: BlockType.LEAVES },
    { x: 0, y: 4, z: 2, type: BlockType.LEAVES },
    { x: 0, y: 4, z: -2, type: BlockType.LEAVES },
    { x: 1, y: 2, z: 0, type: BlockType.LEAVES },
    { x: -1, y: 2, z: 0, type: BlockType.LEAVES },
    { x: 0, y: 2, z: 1, type: BlockType.LEAVES },
    { x: 0, y: 2, z: -1, type: BlockType.LEAVES }
];

const smallPineTree: PositionedBlock[] = [
    { x: 1, y: -1, z: 0, type: BlockType.DRY_DIRT },
    { x: -1, y: -1, z: 0, type: BlockType.DRY_DIRT },
    { x: 0, y: -1, z: 1, type: BlockType.DRY_DIRT },
    { x: 0, y: -1, z: -1, type: BlockType.DRY_DIRT },
    { x: 0, y: 0, z: 0, type: BlockType.TREE },
    { x: 0, y: 1, z: 0, type: BlockType.TREE },
    { x: 0, y: 2, z: 0, type: BlockType.TREE },
    { x: 0, y: 3, z: 0, type: BlockType.TREE },
    { x: 0, y: 4, z: 0, type: BlockType.TREE },
    { x: 0, y: 5, z: 0, type: BlockType.LEAVES },
    { x: 1, y: 4, z: 0, type: BlockType.LEAVES },
    { x: -1, y: 4, z: 0, type: BlockType.LEAVES },
    { x: 0, y: 4, z: 1, type: BlockType.LEAVES },
    { x: 0, y: 4, z: -1, type: BlockType.LEAVES },
    { x: 0, y: 2, z: 1, type: BlockType.LEAVES },
    { x: 0, y: 2, z: -1, type: BlockType.LEAVES },
    { x: 1, y: 2, z: 0, type: BlockType.LEAVES },
    { x: -1, y: 2, z: 0, type: BlockType.LEAVES },
];

const CaveTemplate: PositionedBlock[] = [
    { x: 0, y: 0, z: 0, type: BlockType.DIRT },
    { x: 1, y: 0, z: 0, type: BlockType.DIRT },
    { x: -1, y: 0, z: 0, type: BlockType.DIRT },
    { x: 0, y: 0, z: 1, type: BlockType.DIRT },
    { x: 0, y: 0, z: -1, type: BlockType.DIRT },
    { x: 0, y: 1, z: 0, type: BlockType.DIRT },
    { x: 0, y: -1, z: 0, type: BlockType.DIRT },

    { x: 1, y: 1, z: 1, type: BlockType.DIRT },
    { x: -1, y: 1, z: 1, type: BlockType.DIRT },
    { x: -1, y: 1, z: -1, type: BlockType.DIRT },
    { x: 1, y: 1, z: -1, type: BlockType.DIRT },
    { x: 1, y: -1, z: 1, type: BlockType.DIRT },
    { x: -1, y: -1, z: 1, type: BlockType.DIRT },
    { x: -1, y: -1, z: -1, type: BlockType.DIRT },
    { x: 1, y: -1, z: -1, type: BlockType.DIRT }
];

export class BorrealForestChunkGenerator implements ChunkGenerator {
    public generateChunk(chunk: Chunk): void {
        BorrealForestChunkGenerator.generateTerrain(chunk);
        BorrealForestChunkGenerator.generateTrees(chunk);
        BorrealForestChunkGenerator.generateStones(chunk);
        BorrealForestChunkGenerator.generateVegetation(chunk);
        // BorrealForestChunkGenerator.generateSmallStones(chunk);

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
                    const noiseY = worldY / 100;
                    const noiseZ = worldZ / 100;

                    const layer1 = noise(noiseX * frequency, noiseZ * frequency);
                    const layer2 = 0.5 * noise(noiseX * frequency * 2, noiseZ * frequency * 2);
                    const layer3 = 0.25 * noise(noiseX * frequency * 4, noiseZ * frequency * 4);

                    const limit = amplitude * ((layer1 + layer2 + layer3));
                    const isGround = worldY <= Math.round(limit);

                    const caveNoiseX = worldX / 180;
                    const caveNoiseY = worldY / 180;
                    const caveNoiseZ = worldZ / 180;
                    const caveFrequency = 5;

                    const caveLayer = noise3d(caveNoiseX * caveFrequency, caveNoiseY * caveFrequency, caveNoiseZ * caveFrequency);
                    const caveLayer2 = 0.5 * noise3d(caveNoiseX * 2 * caveFrequency, caveNoiseY * 2 * caveFrequency, caveNoiseZ * 2 * caveFrequency);
                    const caveLayer3 = 0.25 * noise3d(caveNoiseX * 4 * caveFrequency, caveNoiseY * 4 * caveFrequency, caveNoiseZ * 4 * caveFrequency);
                    const caveLimit = caveLayer + caveLayer2 + caveLayer3;
                    const isCave = .5 <= Math.round(caveLimit);

                    let type;

                    if (isGround && worldY > 80) {
                        type = BlockType.SNOW;
                    } else if (isCave && isGround) {
                        type = BlockType.AIR;
                    } else if (isGround && worldY > 0) {
                        type = BlockType.DIRT;
                    } else if (isGround && worldY <= 0) {
                        type = BlockType.SAND;
                    } else if (worldY <= 6) {
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
        const generator = new MersenneTwister(123);
        const sampler = new PoissonDiskSampling([ Chunk.SIZE + 1, Chunk.SIZE + 1 ], 5, 30, 0, () => generator.random());
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
                    if (generator.random() < 0.5) {
                        ChunkUtils.applyTemplate(chunk, pos, mediumPineTree);
                    } else if (generator.random() < 0.5) {
                        ChunkUtils.applyTemplate(chunk, pos, largePineTree);
                    } else if (generator.random() < 0.5) {
                        ChunkUtils.applyTemplate(chunk, pos, smallPineTree);
                    } 
                    // else {
                    //     ChunkUtils.applyTemplate(chunk, pos, fallenPineTree);
                    // }
                    break;
                }
            }
        }
    }

    private static generateVegetation(chunk: Chunk): void {
        const generator = new MersenneTwister(123);
        const sampler = new PoissonDiskSampling([ Chunk.SIZE + 1, Chunk.SIZE + 1 ], 1, 1, 20, () => generator.random());
        const points = sampler.fill();
        const types = [BlockType.DIRT, BlockType.DRY_DIRT, BlockType.STONE, BlockType.MOSSY_STONE];

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

                if (block.type === BlockType.AIR && previous.type === BlockType.DRY_DIRT) {
                    if (generator.random() < .9) {
                        chunk.setBlock(pos, {type: BlockType.TWIG});
                    } else {
                        chunk.setBlock(pos, {type: BlockType.SMALL_STONE});  
                    }
                } else if (block.type === BlockType.AIR && types.includes(previous.type)) {
                    if (generator.random() < .95) {
                        chunk.setBlock(pos, {type: BlockType.MOSS});
                    } else if (generator.random() < .5) {
                        chunk.setBlock(pos, {type: BlockType.SMALL_STONE});
                    } else {
                        chunk.setBlock(pos, {type: BlockType.TWIG});
                    }
                    break;
                }
            }
        }
    }
    
    private static generateStones(chunk: Chunk): void {
        const generator = new MersenneTwister(123);
        const sampler = new PoissonDiskSampling([ Chunk.SIZE - 1, Chunk.SIZE - 1 ], 10, 20, 10, () => generator.random());
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
                    if (generator.random() < .5) {
                        chunk.setBlock(pos, {type: BlockType.MOSSY_STONE});
                    } else {
                        chunk.setBlock(pos, {type: BlockType.STONE});
                    }
                    break;
                }
            }
        }
    }

    // getSurroundWallCount(x, y, z) {
    //     let wallCount = 0;
    //     for (let neighbourX = x - 1; neighbourX > x + 1; neighbourX++) {
    //         for (let neighbourY = y - 1; neighbourY > y + 1; neighbourY++) {
    //             for (let neighbourZ = z - 1; neighbourZ > z + 1; neighbourZ++) {
    //                 if (neighbourX != x || neighbourY != y || neighbourZ != z) {
    //                     wallCount += 1;
    //                 }
    //             }
    //         }
    //     }
    //     return wallCount;
    // }

    private static generateWorms(chunk: Chunk): void {
        const xOffset = chunk.x * Chunk.SIZE;
        const yOffset = chunk.y * Chunk.SIZE;
        const zOffset = chunk.z * Chunk.SIZE;
        const fill = 0.02;

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

                    if (Math.random() < fill) {
                        chunk.setBlock({ x: blockX, y: blockY, z: blockZ }, { type: BlockType.DIRT });
                    }
                }
            }
        }

        // for (let blockX = 0; blockX < Chunk.SIZE; blockX++) {
        //     for (let blockY = 0; blockY < Chunk.SIZE; blockY++) {
        //         for (let blockZ = 0; blockZ < Chunk.SIZE; blockZ++) {
        //             if (blockX == 0 || blockX == Chunk.SIZE || blockZ == 0 || blockZ == Chunk.SIZE || blockY == 0 || blockY == Chunk.SIZE) {
        //                 map.push({[blockX, blockY, blockZ]: 1});
        //             } else {
        //                 if (Math.random() * 100 < fill) {
        //                     map[blockX][blockY][blockZ] = 1;
        //                 }
        //             }
        //         }
        //     }
        // }
        // for (let blockX = 0; blockX < Chunk.SIZE; blockX++) {
        //     for (let blockY = 0; blockY < Chunk.SIZE; blockY++) {
        //         for (let blockZ = 0; blockZ < Chunk.SIZE; blockZ++) {
        //             let neighbourWallCount = this.getSurroundWallCount(blockX, blockY, blockZ);
        //             if (neighbourWallCount >= 4) {
        //                 map[blockX][blockY][blockZ] = 1;
        //             } else if (neighbourWallCount < 4) {
        //                 map[blockX][blockY][blockZ] = 0;
        //             }
        //         }
        //     }
        // }
        // for (let blockX = 0; blockX < Chunk.SIZE; blockX++) {
        //     for (let blockY = 0; blockY < Chunk.SIZE; blockY++) {
        //         for (let blockZ = 0; blockZ < Chunk.SIZE; blockZ++) {
        //             if (map[blockX][blockY][blockZ] === 1) {
        //                 chunk.setBlock(blockX, blockY, blockZ, Block.Type.DIRT);
        //             } else {
        //                 chunk.setBlock(blockX, blockY, blockZ, Block.Type.AIR);
        //             }
        //         }
        //     }
        // }
    }
}
