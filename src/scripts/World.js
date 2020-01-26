import textureAtlas from '../assets/images/textureAtlas.png';
import { makeNoise2D } from 'open-simplex-noise';
import {
    BufferAttribute,
    BufferGeometry,
    DoubleSide,
    Mesh,
    MeshLambertMaterial,
    NearestFilter,
    TextureLoader
} from 'three';

const loader = new TextureLoader();
const texture = loader.load(textureAtlas);
texture.magFilter = NearestFilter;
texture.minFilter = NearestFilter;
const material = new MeshLambertMaterial({ map: texture, side: DoubleSide });
const tileWidth = 16;
const textureWidth = 256;
const noise = makeNoise2D(Math.random() * Number.MAX_SAFE_INTEGER);
const amplitude = 20;
const frequency = 2;

export default class World {
    static CHUNK_SIZE = 32;

    getChunk(chunkX, chunkY, chunkZ = 0) {
        const blocks = [];
        const xOffset = chunkX * World.CHUNK_SIZE;
        const yOffset = chunkY * World.CHUNK_SIZE;
        const zOffset = chunkZ * World.CHUNK_SIZE;

        for (let blockX = 0; blockX < World.CHUNK_SIZE; blockX++) {
            for (let blockY = 0; blockY < World.CHUNK_SIZE; blockY++) {
                for (let blockZ = 0; blockZ < World.CHUNK_SIZE; blockZ++) {
                    const block = this.getBlock(blockX + xOffset, blockY + yOffset, blockZ + zOffset);

                    if (block.type !== BlockType.AIR) {
                        blocks.push(block);
                    }
                }
            }
        }

        return blocks;
    }

    getBlock(blockX, blockY, blockZ) {
        const block = { x: blockX, y: blockY, z: blockZ };
        const xOffset = blockX / 100;
        const zOffset = blockZ / 100;
        const layer1 = noise(zOffset * frequency, xOffset * frequency);
        const layer2 = 0.5 * noise(zOffset * frequency * 2, xOffset * frequency * 2);
        const layer3 = 0.25 * noise(zOffset * frequency * 4, xOffset * frequency * 4);
        const limit = amplitude * ((layer1 + layer2 + layer3) + 1) / 2 + 1;

        if (blockY <= Math.round(limit)) {
            block.type = BlockType.DIRT;
        } else if (blockY <= 10) {
            block.type = BlockType.WATER;
        } else {
            block.type = BlockType.AIR;
        }

        return block;
    }

    generateMesh(chunk) {
        const positions = [];
        const normals = [];
        const uvs = [];
        const indices = [];

        for (const block of chunk) {
            for (const direction of Direction.all()) {
                const neighbor = this.getBlock(block.x + direction.x, block.y + direction.y, block.z + direction.z);
                const neighborIsSameType = block.type === neighbor.type;

                if (!isOpaque(neighbor) && !neighborIsSameType) {
                    const index = positions.length / 3;
                    const face = Cube.Face.direction(direction);
                    const textureIndex = getTextureIndex(block, direction);

                    for (const corner of face.corners) {
                        positions.push(corner.x + block.x, corner.y + block.y, corner.z + block.z);
                        normals.push(face.normal.x, face.normal.y, face.normal.z);
                        // TODO double check the second argument is correct
                        uvs.push((textureIndex + corner.u) * tileWidth / textureWidth,
                            1 - (1 - corner.v) * tileWidth / textureWidth);
                    }

                    indices.push(
                        index, index + 1, index + 2,
                        index + 2, index + 1, index + 3
                    );
                }
            }
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
        geometry.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
        geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
        geometry.setIndex(indices);

        return new Mesh(geometry, material);
    }
}

const BlockType = {
    AIR: 0,
    DIRT: 1,
    WATER: 2
};

function isOpaque(block) {
    return block.type === BlockType.DIRT;
}

function getTextureIndex(block, direction) {
    switch (block.type) {
        case BlockType.DIRT:
            if (direction === Direction.TOP) {
                return 0;
            } else {
                return 2;
            }
        case BlockType.WATER:
            return 3;
        default:
            throw 'Unknown or invalid block type';
    }
}

const Direction = {
    LEFT: { x: -1, y: 0, z: 0 },
    RIGHT: { x: 1, y: 0, z: 0 },
    BOTTOM: { x: 0, y: -1, z: 0 },
    TOP: { x: 0, y: 1, z: 0 },
    BACK: { x: 0, y: 0, z: -1 },
    FRONT: { x: 0, y: 0, z: 1 },

    all() {
        return [
            Direction.LEFT, Direction.RIGHT, Direction.BOTTOM, Direction.TOP, Direction.BACK, Direction.FRONT
        ];
    }
};

const Cube = {
    Face: {
        LEFT: {
            corners: [
                { x: 0, y: 1, z: 0, u: 0, v: 1 },
                { x: 0, y: 0, z: 0, u: 0, v: 0 },
                { x: 0, y: 1, z: 1, u: 1, v: 1 },
                { x: 0, y: 0, z: 1, u: 1, v: 0 }
            ],
            normal: Direction.LEFT
        },
        RIGHT: {
            corners: [
                { x: 1, y: 1, z: 1, u: 0, v: 1 },
                { x: 1, y: 0, z: 1, u: 0, v: 0 },
                { x: 1, y: 1, z: 0, u: 1, v: 1 },
                { x: 1, y: 0, z: 0, u: 1, v: 0 }
            ],
            normal: Direction.RIGHT
        },
        BOTTOM: {
            corners: [
                { x: 1, y: 0, z: 1, u: 1, v: 0 },
                { x: 0, y: 0, z: 1, u: 0, v: 0 },
                { x: 1, y: 0, z: 0, u: 1, v: 1 },
                { x: 0, y: 0, z: 0, u: 0, v: 1 }
            ],
            normal: Direction.BOTTOM
        },
        TOP: {
            corners: [
                { x: 0, y: 1, z: 1, u: 1, v: 1 },
                { x: 1, y: 1, z: 1, u: 0, v: 1 },
                { x: 0, y: 1, z: 0, u: 1, v: 0 },
                { x: 1, y: 1, z: 0, u: 0, v: 0 }
            ],
            normal: Direction.TOP
        },
        BACK: {
            corners: [
                { x: 1, y: 0, z: 0, u: 0, v: 0 },
                { x: 0, y: 0, z: 0, u: 1, v: 0 },
                { x: 1, y: 1, z: 0, u: 0, v: 1 },
                { x: 0, y: 1, z: 0, u: 1, v: 1 }
            ],
            normal: Direction.BACK
        },
        FRONT: {
            corners: [
                { x: 0, y: 0, z: 1, u: 0, v: 0 },
                { x: 1, y: 0, z: 1, u: 1, v: 0 },
                { x: 0, y: 1, z: 1, u: 0, v: 1 },
                { x: 1, y: 1, z: 1, u: 1, v: 1 }
            ],
            normal: Direction.FRONT
        },

        direction(direction) {
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

        all() {
            return [
                Cube.Face.LEFT, Cube.Face.RIGHT, Cube.Face.BOTTOM, Cube.Face.TOP, Cube.Face.BACK, Cube.Face.FRONT
            ];
        }
    }
};
