import { makeNoise2D } from 'open-simplex-noise';
import Block from './Block';
import Chunk from './Chunk';
import World from './World';
import PoissonDiskSampling from 'poisson-disk-sampling';

const noise = makeNoise2D(Math.random() * Number.MAX_SAFE_INTEGER);
const amplitude = 15;
const frequency = 1.5;

export default class ChunkGenerator {
    generateChunk(x, y, z, world) {
        const chunk = new Chunk(x, y, z, world);

        this.generateTerrain(chunk);
        this.generateTrees(chunk);

        return chunk;
    }

    generateTerrain(chunk) {
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
                    const noiseY = worldZ / 100;
                    const layer1 = noise(noiseX * frequency, noiseY * frequency);
                    const layer2 = 0.5 * noise(noiseX * frequency * 2, noiseY * frequency * 2);
                    const layer3 = 0.25 * noise(noiseX * frequency * 4, noiseY * frequency * 4);
                    const limit = amplitude * ((layer1 + layer2 + layer3) + 1) / 2;
                    const isGround = worldY <= Math.round(limit);

                    let type;

                    if (isGround && worldY > 30) {
                        type = Block.Type.SNOW;
                    } else if (isGround && worldY > 20) {
                        type = Block.Type.STONE;
                    } else if (isGround && worldY > 11) {
                        type = Block.Type.DIRT;
                    } else if (isGround && worldY <= 11) {
                        type = Block.Type.SAND;
                    } else if (worldY <= 10) {
                        type = Block.Type.WATER;
                    } else {
                        type = Block.Type.AIR;
                    }

                    chunk.setBlock(blockX, blockY, blockZ, type);
                }
            }
        }
    }

    generateTrees(chunk) {
        const sampler = new PoissonDiskSampling([ World.CHUNK_SIZE - 1, World.CHUNK_SIZE - 1 ], 6, 1000, 30);
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

    applyTemplate(x, y, z, chunk, template) {
        for (const block of template) {
            chunk.setBlock(x + block.x, y + block.y, z + block.z, block.type);
        }
    }
}

const TreeTemplate = [
    { x: 0, y: 0, z: 0, type: Block.Type.TREE },
    { x: 0, y: 1, z: 0, type: Block.Type.TREE },
    { x: 0, y: 2, z: 0, type: Block.Type.TREE },
    { x: 0, y: 3, z: 0, type: Block.Type.TREE },
    { x: -1, y: 4, z: -1, type: Block.Type.LEAVES },
    { x: -1, y: 4, z: 0, type: Block.Type.LEAVES },
    { x: -1, y: 4, z: 1, type: Block.Type.LEAVES },
    { x: 0, y: 4, z: -1, type: Block.Type.LEAVES },
    { x: 0, y: 4, z: 0, type: Block.Type.TREE },
    { x: 0, y: 4, z: 1, type: Block.Type.LEAVES },
    { x: 1, y: 4, z: -1, type: Block.Type.LEAVES },
    { x: 1, y: 4, z: 0, type: Block.Type.LEAVES },
    { x: 1, y: 4, z: 1, type: Block.Type.LEAVES },
    { x: -2, y: 5, z: -2, type: Block.Type.LEAVES },
    { x: -2, y: 5, z: -1, type: Block.Type.LEAVES },
    { x: -2, y: 5, z: 0, type: Block.Type.LEAVES },
    { x: -2, y: 5, z: 1, type: Block.Type.LEAVES },
    { x: -2, y: 5, z: 2, type: Block.Type.LEAVES },
    { x: -1, y: 5, z: -2, type: Block.Type.LEAVES },
    { x: -1, y: 5, z: -1, type: Block.Type.LEAVES },
    { x: -1, y: 5, z: 0, type: Block.Type.LEAVES },
    { x: -1, y: 5, z: 1, type: Block.Type.LEAVES },
    { x: -1, y: 5, z: 2, type: Block.Type.LEAVES },
    { x: 0, y: 5, z: -2, type: Block.Type.LEAVES },
    { x: 0, y: 5, z: -1, type: Block.Type.LEAVES },
    { x: 0, y: 5, z: 0, type: Block.Type.LEAVES },
    { x: 0, y: 5, z: 1, type: Block.Type.LEAVES },
    { x: 0, y: 5, z: 2, type: Block.Type.LEAVES },
    { x: 1, y: 5, z: -2, type: Block.Type.LEAVES },
    { x: 1, y: 5, z: -1, type: Block.Type.LEAVES },
    { x: 1, y: 5, z: 0, type: Block.Type.LEAVES },
    { x: 1, y: 5, z: 1, type: Block.Type.LEAVES },
    { x: 1, y: 5, z: 2, type: Block.Type.LEAVES },
    { x: 2, y: 5, z: -2, type: Block.Type.LEAVES },
    { x: 2, y: 5, z: -1, type: Block.Type.LEAVES },
    { x: 2, y: 5, z: 0, type: Block.Type.LEAVES },
    { x: 2, y: 5, z: 1, type: Block.Type.LEAVES },
    { x: 2, y: 5, z: 2, type: Block.Type.LEAVES },
    { x: -1, y: 6, z: -1, type: Block.Type.LEAVES },
    { x: -1, y: 6, z: 0, type: Block.Type.LEAVES },
    { x: -1, y: 6, z: 1, type: Block.Type.LEAVES },
    { x: 0, y: 6, z: -1, type: Block.Type.LEAVES },
    { x: 0, y: 6, z: 0, type: Block.Type.LEAVES },
    { x: 0, y: 6, z: 1, type: Block.Type.LEAVES },
    { x: 1, y: 6, z: -1, type: Block.Type.LEAVES },
    { x: 1, y: 6, z: 0, type: Block.Type.LEAVES },
    { x: 1, y: 6, z: 1, type: Block.Type.LEAVES }
];
