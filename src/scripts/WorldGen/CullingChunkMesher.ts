import { Direction } from '../Util/Direction';
import { Coordinate3, MeshData } from '../Util/Math';
import { Block, BlockType, BlockUtils, PositionedBlock } from './Block';
import { Chunk, ChunkMesher } from './Chunk';
import { BlockMesher, StandardBlockMesher, WaterBlockMesher, CrossBlockMesher } from './BlockMesher';

const tileWidth = 16;
const textureWidth = 256;

export class CullingChunkMesher implements ChunkMesher {
    public constructor(
        private readonly blockTypes: BlockType[]
    ) {}

    public createMesh(chunk: Chunk): MeshData {
        const vertices = [];
        const normals = [];
        const uvs = [];
        const indices = [];

        for (let x = 0; x < Chunk.SIZE; x++) {
            for (let y = 0; y < Chunk.SIZE; y++) {
                for (let z = 0; z < Chunk.SIZE; z++) {
                    const block = chunk.getBlock({ x, y, z });

                    if (block.type === BlockType.AIR) {
                        continue;
                    }

                    if (!this.blockTypes.includes(block.type)) {
                        continue;
                    }

                    for (const direction of Direction.all()) {
                        const neighbor = chunk.getBlock({ x: x + direction.x, y: y + direction.y, z: z + direction.z });
                        const neighborIsSameType = block.type === neighbor.type;

                        if (!BlockUtils.isOpaque(neighbor) && !neighborIsSameType) {
                            const index = vertices.length / 3;
                            const textureIndex = CullingChunkMesher.getTextureIndex(chunk, { x, y, z, type: block.type }, direction);
                            const mesher = CullingChunkMesher.getBlockMesher(block.type);
                            let i = -1;
                            let a = -1;
                            vertices.push(...mesher.vertices.map(e => {
                                i ++;
                                switch (i % 3) {
                                    case 0:
                                        return e + x;
                                    case 1:
                                        return e + y;
                                    case 2:
                                        return e + z;
                                    default:
                                        throw 'ERROR BAJS';
                                }
                            }));
                            normals.push(...mesher.normal);
                            uvs.push(...mesher.uvs.map(e => {
                                a ++;
                                switch (a % 2) {
                                    case 0:
                                        return (textureIndex + e) * tileWidth / textureWidth;
                                    case 1:
                                        return 1 - (1 - e) * tileWidth / textureWidth;
                                    default:
                                        throw 'ERROR BAJS';
                                }
                            }));
                            indices.push(...mesher.indices.map(e => e + index));
                        }
                    }
                }
            }
        }
        
        return { vertices, normals, uvs, indices };
    }

    private static getBlockMesher(type: BlockType): BlockMesher {
        if (type === BlockType.WATER) {
            return new WaterBlockMesher();
        } else if (type === BlockType.GRASS || type === BlockType.MOSS || type === BlockType.BLUEBERRIES || type === BlockType.LINGONBERRIES) {
            return new CrossBlockMesher();
        } 
        return new StandardBlockMesher();
    }

    private static getTextureIndex(chunk: Chunk, block: PositionedBlock, direction: Coordinate3): number {
        const topBlock = CullingChunkMesher.getAdjacentBlock(chunk, block, Direction.TOP);
        const bottomBlock = CullingChunkMesher.getAdjacentBlock(chunk, block, Direction.BOTTOM);

        if (block.type === BlockType.DIRT && topBlock.type === BlockType.DIRT) {
            return 1;
        } else if (block.type === BlockType.LEAVES && bottomBlock.type !== BlockType.AIR) {
            return 11;
        }

        switch (block.type) {
            case BlockType.DIRT:
                return 0;
            case BlockType.MOSSY_DIRT:
                return 1;
            case BlockType.DRY_DIRT:
                return 2;
            case BlockType.WATER:
                return 3;
            case BlockType.SAND:
                return 4;
            case BlockType.STONE:
                return 5;
            case BlockType.MOSSY_STONE:
                return 6;
            case BlockType.SNOW:
                return 7;
            case BlockType.TREE:
                if (direction === Direction.TOP || direction === Direction.BOTTOM) {
                    return 9;
                } else {
                    return 8;
                }
            case BlockType.LEAVES:
                if (direction === Direction.TOP || direction === Direction.BOTTOM) {
                    return 11;
                } else {
                    return 10;
                }
            case BlockType.MOSS: 
                return 12;
            case BlockType.GRASS:
                return 13;
            case BlockType.BLUEBERRIES:
                return 14;
            case BlockType.LINGONBERRIES:
                return 15;
            default:
                throw 'Unknown or invalid block type' + block.type;
        }
    }

    private static getAdjacentBlock(chunk: Chunk, block: PositionedBlock, direction: Coordinate3): Block {
        return chunk.getBlock({ x: block.x + direction.x, y: block.y + direction.y, z: block.z + direction.z });
    }
}
