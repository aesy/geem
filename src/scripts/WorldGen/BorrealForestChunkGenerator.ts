/* eslint-disable for-direction */
import { makeNoise2D, makeNoise3D } from 'open-simplex-noise';
import Block from './Block';
import Chunk from './Chunk';
import World from './World';
// @ts-ignore
import PoissonDiskSampling from 'poisson-disk-sampling';

const noise = makeNoise2D(Math.random() * Number.MAX_SAFE_INTEGER);
const noise3d = makeNoise3D(Math.random() * Number.MAX_SAFE_INTEGER);
const amplitude = 40;
const frequency = .5;

const TreeTemplate = [
    { x: 0, y: 0, z: 0, type: Block.Type.TREE },
    { x: 0, y: 1, z: 0, type: Block.Type.TREE },
    { x: 0, y: 2, z: 0, type: Block.Type.TREE },
    { x: 0, y: 3, z: 0, type: Block.Type.TREE },
    { x: 0, y: 4, z: 0, type: Block.Type.TREE },
    { x: 0, y: 5, z: 0, type: Block.Type.TREE },
    { x: 0, y: 6, z: 0, type: Block.Type.TREE },
    { x: 0, y: 7, z: 0, type: Block.Type.TREE },
    { x: 0, y: 8, z: 0, type: Block.Type.TREE },
    { x: 0, y: 9, z: 0, type: Block.Type.TREE },
    { x: 0, y: 10, z: 0, type: Block.Type.TREE },
    { x: 0, y: 11, z: 0, type: Block.Type.LEAVES },
    { x: 1, y: 10, z: 0, type: Block.Type.LEAVES },
    { x: -1, y: 10, z: 0, type: Block.Type.LEAVES },
    { x: 0, y: 10, z: 1, type: Block.Type.LEAVES },
    { x: 0, y: 10, z: -1, type: Block.Type.LEAVES },
    { x: 1, y: 8, z: 0, type: Block.Type.LEAVES },
    { x: -1, y: 8, z: 0, type: Block.Type.LEAVES },
    { x: 0, y: 8, z: 1, type: Block.Type.LEAVES },
    { x: 0, y: 8, z: -1, type: Block.Type.LEAVES },
    { x: 1, y: 7, z: 0, type: Block.Type.LEAVES },
    { x: -1, y: 7, z: 0, type: Block.Type.LEAVES },
    { x: 0, y: 7, z: 1, type: Block.Type.LEAVES },
    { x: 0, y: 7, z: -1, type: Block.Type.LEAVES },
    { x: 1, y: 5, z: 0, type: Block.Type.LEAVES },
    { x: -1, y: 5, z: 0, type: Block.Type.LEAVES },
    { x: 0, y: 5, z: 1, type: Block.Type.LEAVES },
    { x: 0, y: 5, z: -1, type: Block.Type.LEAVES },
    { x: 1, y: 4, z: 0, type: Block.Type.LEAVES },
    { x: -1, y: 4, z: 0, type: Block.Type.LEAVES },
    { x: 0, y: 4, z: 1, type: Block.Type.LEAVES },
    { x: 0, y: 4, z: -1, type: Block.Type.LEAVES },
    { x: 2, y: 4, z: 0, type: Block.Type.LEAVES },
    { x: -2, y: 4, z: 0, type: Block.Type.LEAVES },
    { x: 0, y: 4, z: 2, type: Block.Type.LEAVES },
    { x: 0, y: 4, z: -2, type: Block.Type.LEAVES },
    { x: 1, y: 2, z: 0, type: Block.Type.LEAVES },
    { x: -1, y: 2, z: 0, type: Block.Type.LEAVES },
    { x: 0, y: 2, z: 1, type: Block.Type.LEAVES },
    { x: 0, y: 2, z: -1, type: Block.Type.LEAVES }
];

const CaveTemplate = [
    { x: 0, y: 0, z: 0, type: Block.Type.DIRT },
    { x: 1, y: 0, z: 0, type: Block.Type.DIRT },
    { x: -1, y: 0, z: 0, type: Block.Type.DIRT },
    { x: 0, y: 0, z: 1, type: Block.Type.DIRT },
    { x: 0, y: 0, z: -1, type: Block.Type.DIRT },
    { x: 0, y: 1, z: 0, type: Block.Type.DIRT },
    { x: 0, y: -1, z: 0, type: Block.Type.DIRT },

    { x: 1, y: 1, z: 1, type: Block.Type.DIRT },
    { x: -1, y: 1, z: 1, type: Block.Type.DIRT },
    { x: -1, y: 1, z: -1, type: Block.Type.DIRT },
    { x: 1, y: 1, z: -1, type: Block.Type.DIRT },
    { x: 1, y: -1, z: 1, type: Block.Type.DIRT },
    { x: -1, y: -1, z: 1, type: Block.Type.DIRT },
    { x: -1, y: -1, z: -1, type: Block.Type.DIRT },
    { x: 1, y: -1, z: -1, type: Block.Type.DIRT },
];

export default class BorrealForestChunkGenerator {
    generateChunk(x: number, y: number, z: number, world: World): Chunk {
        const chunk = new Chunk(x, y, z, world);

        this.generateTerrain(chunk);
        // this.generateWorms(chunk);
        this.generateTrees(chunk);

        return chunk;
    }

    generateTerrain(chunk: Chunk): void {
        const xOffset = chunk.x * World.CHUNK_SIZE;
        const yOffset = chunk.y * World.CHUNK_SIZE;
        const zOffset = chunk.z * World.CHUNK_SIZE;

        for (let blockX = 0; blockX < World.CHUNK_SIZE; blockX++) {
            for (let blockY = 0; blockY < World.CHUNK_SIZE; blockY++) {
                for (let blockZ = 0; blockZ < World.CHUNK_SIZE; blockZ++) {
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
                    const isCave =  .5 <= Math.round(caveLimit);

                    let type;

                    if (isGround && worldY > 80) {
                        type = Block.Type.SNOW;
                    } else if (isCave && isGround) {
                        type = Block.Type.AIR;
                    } else if (isGround && worldY > 0) {
                        type = Block.Type.DIRT;
                    } else if (isGround && worldY <= 0) {
                        type = Block.Type.SAND;
                    } else if (worldY <= 6) {
                        type = Block.Type.WATER;
                    } else {
                        type = Block.Type.AIR;
                    }

                    chunk.setBlock(blockX, blockY, blockZ, type);
                }
            }
        }
    }

    generateTrees(chunk: Chunk): void {
        const sampler = new PoissonDiskSampling([ World.CHUNK_SIZE - 1, World.CHUNK_SIZE - 1 ], 5, 20, 10);
        const points = sampler.fill();

        for (const point of points) {
            const x = Math.floor(point[ 0 ]);
            const z = Math.floor(point[ 1 ]);

            for (let y = 0; y < World.CHUNK_SIZE; y++) {
                const block = chunk.getBlock(x, y, z);

                if (y === 0) {
                    continue;
                }

                const previous = chunk.getBlock(x, y - 1, z);

                if (block.type === Block.Type.AIR && previous.type === Block.Type.DIRT) {
                    this.applyTemplate(x, y, z, chunk, TreeTemplate);
                    break;
                }
            }
        }
    }

    generateCaves(chunk: Chunk): void {
        const xOffset = chunk.x * World.CHUNK_SIZE;
        const yOffset = chunk.y * World.CHUNK_SIZE;
        const zOffset = chunk.z * World.CHUNK_SIZE;

        for (let blockX = 0; blockX < World.CHUNK_SIZE; blockX++) {
            for (let blockY = 0; blockY < World.CHUNK_SIZE; blockY++) {
                for (let blockZ = 0; blockZ < World.CHUNK_SIZE; blockZ++) {
                    const worldX = (blockX + xOffset);
                    const worldY = (blockY + yOffset);
                    const worldZ = (blockZ + zOffset);

                    const noiseX = worldX / 100;
                    const noiseY = worldY / 100;
                    const noiseZ = worldZ / 100;

                    const layer = noise3d(noiseX * frequency, noiseY * frequency, noiseZ * frequency);
                    const layer2 = 0.5 * noise3d(noiseX * 2 * frequency, noiseY * 2 * frequency, noiseZ * 2 * frequency);
                    const layer3 = 0.25 * noise3d(noiseX * 4 * frequency, noiseY * 4 * frequency, noiseZ * 4 * frequency);
                    const limit = layer + layer2 + layer3;
                    const isGround =  0 <= Math.round(limit);
                    let type;

                    if (isGround) {
                        type = Block.Type.STONE;
                    } else {
                        type = Block.Type.AIR;
                    }

                    chunk.setBlock(blockX, blockY, blockZ, type);
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

    generateWorms(chunk: Chunk): void {
        const xOffset = chunk.x * World.CHUNK_SIZE;
        const yOffset = chunk.y * World.CHUNK_SIZE;
        const zOffset = chunk.z * World.CHUNK_SIZE;
        const fill = 0.02;

        for (let blockX = 0; blockX < World.CHUNK_SIZE; blockX++) {
            for (let blockY = 0; blockY < World.CHUNK_SIZE; blockY++) {
                for (let blockZ = 0; blockZ < World.CHUNK_SIZE; blockZ++) {
                    const worldX = (blockX + xOffset);
                    const worldY = (blockY + yOffset);
                    const worldZ = (blockZ + zOffset);

                    const noiseX = worldX / 100;
                    const noiseY = worldZ / 100;
                    const layer1 = noise(noiseX * frequency, noiseY * frequency);
                    const layer2 = 0.5 * noise(noiseX * frequency * 2, noiseY * frequency * 2);
                    const layer3 = 0.25 * noise(noiseX * frequency * 4, noiseY * frequency * 4);

                    if (Math.random() < fill) {
                        chunk.setBlock(blockX, blockY, blockZ, Block.Type.DIRT);
                    }
                }
            }
        }


        // for (let blockX = 0; blockX < World.CHUNK_SIZE; blockX++) {
        //     for (let blockY = 0; blockY < World.CHUNK_SIZE; blockY++) {
        //         for (let blockZ = 0; blockZ < World.CHUNK_SIZE; blockZ++) {
        //             if (blockX == 0 || blockX == World.CHUNK_SIZE || blockZ == 0 || blockZ == World.CHUNK_SIZE || blockY == 0 || blockY == World.CHUNK_SIZE) {
        //                 map.push({[blockX, blockY, blockZ]: 1});
        //             } else {
        //                 if (Math.random() * 100 < fill) {
        //                     map[blockX][blockY][blockZ] = 1;
        //                 }
        //             }
        //         }
        //     }
        // }
        // for (let blockX = 0; blockX < World.CHUNK_SIZE; blockX++) {
        //     for (let blockY = 0; blockY < World.CHUNK_SIZE; blockY++) {
        //         for (let blockZ = 0; blockZ < World.CHUNK_SIZE; blockZ++) {
        //             let neighbourWallCount = this.getSurroundWallCount(blockX, blockY, blockZ);
        //             if (neighbourWallCount >= 4) {
        //                 map[blockX][blockY][blockZ] = 1;
        //             } else if (neighbourWallCount < 4) {
        //                 map[blockX][blockY][blockZ] = 0;
        //             }
        //         }
        //     }
        // }
        // for (let blockX = 0; blockX < World.CHUNK_SIZE; blockX++) {
        //     for (let blockY = 0; blockY < World.CHUNK_SIZE; blockY++) {
        //         for (let blockZ = 0; blockZ < World.CHUNK_SIZE; blockZ++) {
        //             if (map[blockX][blockY][blockZ] === 1) {
        //                 chunk.setBlock(blockX, blockY, blockZ, Block.Type.DIRT);
        //             } else {
        //                 chunk.setBlock(blockX, blockY, blockZ, Block.Type.AIR);
        //             }
        //         }
        //     }
        // }
    }

    applyTemplate(x: number, y: number, z: number, chunk: Chunk, template: any[]): void {
        for (const block of template) {
            chunk.setBlock(x + block.x, y + block.y, z + block.z, block.type);
        }
    }
}
