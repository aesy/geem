import { Direction } from '../Util/Direction';
import { Coordinate3, MeshData } from '../Util/Math';
import { Block, BlockType, BlockUtils, PositionedBlock } from './Block';
import { Chunk, ChunkMesher } from './Chunk';

const tileWidth = 16;
const textureWidth = 256;

const Cube = {
    Face: {
        LEFT: {
            corners: [
                { x: 0, y: 1, z: 0, u: 0.01, v: 0.99 },
                { x: 0, y: 0, z: 0, u: 0.01, v: 0.01 },
                { x: 0, y: 1, z: 1, u: 0.99, v: 0.99 },
                { x: 0, y: 0, z: 1, u: 0.99, v: 0.01 }
            ],
            normal: Direction.LEFT
        },
        RIGHT: {
            corners: [
                { x: 1, y: 1, z: 1, u: 0.01, v: 0.99 },
                { x: 1, y: 0, z: 1, u: 0.01, v: 0.01 },
                { x: 1, y: 1, z: 0, u: 0.99, v: 0.99 },
                { x: 1, y: 0, z: 0, u: 0.99, v: 0.01 }
            ],
            normal: Direction.RIGHT
        },
        BOTTOM: {
            corners: [
                { x: 1, y: 0, z: 1, u: 0.99, v: 0.01 },
                { x: 0, y: 0, z: 1, u: 0.01, v: 0.01 },
                { x: 1, y: 0, z: 0, u: 0.99, v: 0.99 },
                { x: 0, y: 0, z: 0, u: 0.01, v: 0.99 }
            ],
            normal: Direction.BOTTOM
        },
        TOP: {
            corners: [
                { x: 0, y: 1, z: 1, u: 0.99, v: 0.99 },
                { x: 1, y: 1, z: 1, u: 0.01, v: 0.99 },
                { x: 0, y: 1, z: 0, u: 0.99, v: 0.01 },
                { x: 1, y: 1, z: 0, u: 0.01, v: 0.01 }
            ],
            normal: Direction.TOP
        },
        BACK: {
            corners: [
                { x: 1, y: 0, z: 0, u: 0.01, v: 0.01 },
                { x: 0, y: 0, z: 0, u: 0.99, v: 0.01 },
                { x: 1, y: 1, z: 0, u: 0.01, v: 0.99 },
                { x: 0, y: 1, z: 0, u: 0.99, v: 0.99 }
            ],
            normal: Direction.BACK
        },
        FRONT: {
            corners: [
                { x: 0, y: 0, z: 1, u: 0.01, v: 0.01 },
                { x: 1, y: 0, z: 1, u: 0.99, v: 0.01 },
                { x: 0, y: 1, z: 1, u: 0.01, v: 0.99 },
                { x: 1, y: 1, z: 1, u: 0.99, v: 0.99 }
            ],
            normal: Direction.FRONT
        },

        direction(direction: Coordinate3): any {
            switch (direction) {
                case Direction.LEFT:
                    return Cube.Face.LEFT;
                case Direction.RIGHT:
                    return Cube.Face.RIGHT;
                case Direction.BOTTOM:
                    return Cube.Face.BOTTOM;
                case Direction.TOP:
                    return Cube.Face.TOP;
                case Direction.BACK:
                    return Cube.Face.BACK;
                case Direction.FRONT:
                    return Cube.Face.FRONT;
                default:
                    throw `Unknown direction: ${ direction }`;
            }
        },

        all(): any[] {
            return [
                Cube.Face.LEFT, Cube.Face.RIGHT, Cube.Face.BOTTOM, Cube.Face.TOP, Cube.Face.BACK, Cube.Face.FRONT
            ];
        }
    }
};

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

                    const topBlock = chunk.getBlock({ x: x + Direction.TOP.x, y: y + Direction.TOP.y, z: z + Direction.TOP.z });

                    for (const direction of Direction.all()) {
                        const neighbor = chunk.getBlock({ x: x + direction.x, y: y + direction.y, z: z + direction.z });
                        const neighborIsSameType = block.type === neighbor.type;

                        if (!BlockUtils.isOpaque(neighbor) && !neighborIsSameType) {
                            const index = vertices.length / 3;
                            const face = Cube.Face.direction(direction);
                            const textureIndex = CullingChunkMesher.getTextureIndex(chunk, { x, y, z, type: block.type }, direction);

                            for (const corner of face.corners) {
                                if (block.type === BlockType.WATER && topBlock.type === BlockType.AIR) {
                                    // HACK push water down a notch, it looks nice :-)
                                    vertices.push(x + corner.x, y + corner.y - 0.2, z + corner.z);
                                } else if (block.type === BlockType.LEAVES && direction === Direction.BOTTOM) {
                                    vertices.push(x + corner.x, y + corner.y + 1/8, z + corner.z);
                                } else if (block.type === BlockType.MOSS && direction === Direction.TOP){
                                    vertices.push(x + corner.x, y + corner.y - 15/16, z + corner.z);
                                } else if (block.type === BlockType.SMALL_STONE) {
                                    vertices.push(x + corner.x, y + corner.y - 15/16, z + corner.z);
                                } else if (block.type === BlockType.TWIG) {
                                    vertices.push(x + corner.x, y + corner.y - 15/16, z + corner.z);
                                } else {
                                    vertices.push(x + corner.x, y + corner.y, z + corner.z);
                                }

                             
                    

                                normals.push(face.normal.x, face.normal.y, face.normal.z);

                                // TODO double check the second argument is correct
                                uvs.push(
                                    (textureIndex + corner.u) * tileWidth / textureWidth,
                                    1 - (1 - corner.v) * tileWidth / textureWidth);
                            }

                            indices.push(
                                index, index + 1, index + 2,
                                index + 2, index + 1, index + 3);
                        }
                    }
                }
            }
        }

        return { vertices, normals, uvs, indices };
    }

    private static getTextureIndex(chunk: Chunk, block: PositionedBlock, direction: Coordinate3): number {
        const topBlock = CullingChunkMesher.getAdjacentBlock(chunk, block, Direction.TOP);
        const bottomBlock = CullingChunkMesher.getAdjacentBlock(chunk, block, Direction.BOTTOM);

        if (block.type === BlockType.DIRT && topBlock.type === BlockType.DIRT) {
            return 1;
        } else if (block.type === BlockType.LEAVES && bottomBlock.type !== BlockType.AIR) {
            return 10;
        }

        switch (block.type) {
            case BlockType.STONE:
                return 5;
            case BlockType.MOSSY_STONE:
                return 6;
            case BlockType.SNOW:
                return 6;
            case BlockType.TREE:
                if (direction === Direction.TOP || direction === Direction.BOTTOM) {
                    return 8;
                } else {
                    return 7;
                }
            case BlockType.LEAVES:
                if (direction === Direction.TOP || direction === Direction.BOTTOM) {
                    return 10;
                } else {
                    return 9;
                }
            case BlockType.DIRT:
                return 0;
            case BlockType.DRY_DIRT:
                return 2;
            case BlockType.WATER:
                return 3;
            case BlockType.SAND:
                return 4;
            case BlockType.MOSS:
                if (direction === Direction.TOP || direction === Direction.BOTTOM) {
                    return 11;
                } else {
                    return 12;
                }
            case BlockType.SMALL_STONE:
                return 13;
            case BlockType.TWIG:
                return 14;
            default:
                throw 'Unknown or invalid block type' + block.type;
        }
    }

    private static getAdjacentBlock(chunk: Chunk, block: PositionedBlock, direction: Coordinate3): Block {
        return chunk.getBlock({ x: block.x + direction.x, y: block.y + direction.y, z: block.z + direction.z });
    }
}
