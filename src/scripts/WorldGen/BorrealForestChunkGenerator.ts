// @ts-ignore
import PoissonDiskSampling from 'poisson-disk-sampling';
import { makeNoise2D, makeNoise3D } from 'open-simplex-noise';
import { BlockType, PositionedBlock } from './Block';
import { Chunk, ChunkGenerator, ChunkUtils } from './Chunk';
import MersenneTwister from 'mersenne-twister';
import { Vector3 } from 'three';

const seed = 1337;
const noise = makeNoise2D(seed);
const noise3d = makeNoise3D(seed);

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

export class BorrealForestChunkGenerator implements ChunkGenerator {
    public generateChunk(chunk: Chunk): void {
        BorrealForestChunkGenerator.generateTerrain(chunk);
        BorrealForestChunkGenerator.generateTrees(chunk);
        BorrealForestChunkGenerator.generateStones(chunk);
        BorrealForestChunkGenerator.generateBerries(chunk);
        BorrealForestChunkGenerator.generateVegetation(chunk);
    }
    
    private static fbm(vec: Vector3): number {
        const noiseX = vec.x / 100;
        const noiseZ = vec.z / 100;
        const h = .5;
        const g = Math.exp(-h);
        let amplitude = 20;
        let frequency = .8;
        let t = 0;

        for( let i = 0; i< 3; i++ ) {
            t += amplitude * noise(frequency * noiseX, frequency * noiseZ);
            frequency *= 2;
            amplitude *= g;
        }

        return t;
    }

    private static fbm3d(vec: Vector3): number {
        const noiseX = vec.x / 180;
        const noiseY = vec.y / 180;
        const noiseZ = vec.z / 180;
        const h = 0.5;
        const g = Math.log2(-h);
        let amplitude = 1;
        let frequency = 5;
        let t = 0;

        for( let i = 0; i< 4; i++ ) {
            t += amplitude * noise3d(frequency * noiseX, frequency * noiseY, frequency * noiseZ);
            frequency *= 2;
            amplitude *= g;
        }

        return t;
    }

    private static warp(vec: Vector3): number {
        const x = this.fbm(vec.clone().add(new Vector3(0, 0, 0)));
        const z = this.fbm(vec.clone().add(new Vector3(5.2, 0, 2.3)));

        return this.fbm(vec.clone().add(new Vector3(x, 0, z).multiplyScalar(4)));
    }

    private static generateTerrain(chunk: Chunk): void {
        const generator = new MersenneTwister(seed);
        const xOffset = chunk.x * Chunk.SIZE;
        const yOffset = chunk.y * Chunk.SIZE;
        const zOffset = chunk.z * Chunk.SIZE;

        for (let blockX = 0; blockX < Chunk.SIZE; blockX++) {
            for (let blockY = 0; blockY < Chunk.SIZE; blockY++) {
                for (let blockZ = 0; blockZ < Chunk.SIZE; blockZ++) {
                    const worldX = (blockX + xOffset);
                    const worldY = (blockY + yOffset);
                    const worldZ = (blockZ + zOffset);

                    const vec = new Vector3(worldX, worldY, worldZ);

                    const limit = this.fbm(vec);
                    const isGround = worldY <= Math.round(limit);

                    const isCave = 0.7 <= this.fbm3d(vec);
                    
                    let type;
                    
                    if (isGround && worldY > 80) {
                        type = BlockType.SNOW;
                    } else if (isCave && isGround) {
                        type = BlockType.AIR;
                    } else if (isGround && worldY > 0) {
                        if (generator.random() < 0.7) {
                            type = BlockType.MOSSY_DIRT;
                        } else {
                            type = BlockType.DIRT;
                        }
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
        const generator = new MersenneTwister(seed);
        const sampler = new PoissonDiskSampling([ Chunk.SIZE + 1, Chunk.SIZE + 1 ], 4, 30, 0, () => generator.random());
        const points = sampler.fill();
        const types = [BlockType.DIRT, BlockType.MOSSY_DIRT];      

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

                if (block.type === BlockType.AIR && types.includes(previous.type)) {
                    if (generator.random() < 0.5) {
                        ChunkUtils.applyTemplate(chunk, pos, mediumPineTree);
                    } else if (generator.random() < 0.5) {
                        ChunkUtils.applyTemplate(chunk, pos, largePineTree);
                    } else if (generator.random() < 0.5) {
                        ChunkUtils.applyTemplate(chunk, pos, smallPineTree);
                    } 
                    break;
                }
            }
        }
    }

    private static generateBerries(chunk: Chunk): void {
        const xOffset = chunk.x * Chunk.SIZE;
        const zOffset = chunk.z * Chunk.SIZE;
        const types = [BlockType.DIRT, BlockType.MOSSY_DIRT];

        for (let blockX = 0; blockX < Chunk.SIZE; blockX++) {
            for (let blockY = 0; blockY < Chunk.SIZE; blockY++) {
                for (let blockZ = 0; blockZ < Chunk.SIZE; blockZ++) {
                    const worldX = (blockX + xOffset);
                    const worldZ = (blockZ + zOffset);  

                    const frequency = 0.05;

                    const layer = noise(frequency * worldX, frequency * worldZ);

                    if (layer < -0.75 || layer > 0.75) {
                        for (let y = 0; y < Chunk.SIZE; y++) {
                            const pos = { x: blockX, y: y, z: blockZ };
                            const block = chunk.getBlock(pos);
                            
                            if (y === 0) {
                                continue;
                            }                    

                            const previous = chunk.getBlock({ x: blockX, y: y - 1, z: blockZ });
                            if (block.type === BlockType.AIR && types.includes(previous.type)) {
                                if (layer < -0.75) {
                                    chunk.setBlock(pos, {type: BlockType.LINGONBERRIES})
                                } else {
                                    chunk.setBlock(pos, {type: BlockType.BLUEBERRIES})
                                }
                            }
                        }
                    } 
                }
            }
        }
    }
    
    private static generateStones(chunk: Chunk): void {
        const generator = new MersenneTwister(seed);
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

    private static generateVegetation(chunk: Chunk): void {
        const generator = new MersenneTwister(seed);
        const sampler = new PoissonDiskSampling([ Chunk.SIZE + 1, Chunk.SIZE + 1 ], 1, 1, 20, () => generator.random());
        const points = sampler.fill();
        const types = [BlockType.DIRT, BlockType.MOSSY_DIRT, BlockType.DRY_DIRT, BlockType.STONE, BlockType.MOSSY_STONE];

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

                if (block.type === BlockType.AIR && types.includes(previous.type)) {
                    if (generator.random() < 0.5) {
                        chunk.setBlock(pos, {type: BlockType.MOSS});
                    }
                }
            }
        }
    } 
}