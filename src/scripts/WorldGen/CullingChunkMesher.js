import {
    BufferAttribute,
    BufferGeometry,
    Mesh,
    MeshLambertMaterial,
    NearestFilter,
    RepeatWrapping,
    TextureLoader
} from 'three';
import textureAtlas from '../../assets/images/textureAtlas.png';
import { Direction } from '../Util/Direction';
import Block from './Block';
import World from './World';

const loader = new TextureLoader();
const texture = loader.load(textureAtlas);
texture.wrapS = RepeatWrapping;
texture.wrapT = RepeatWrapping;
texture.magFilter = NearestFilter;
texture.minFilter = NearestFilter;
const material = new MeshLambertMaterial({ map: texture, transparent: true });
const tileWidth = 16;
const textureWidth = 256;

export default class CullingChunkMesher {
    createMesh(chunk) {
        const vertices = [];
        const normals = [];
        const uvs = [];
        const indices = [];

        for (let x = 0; x < World.CHUNK_SIZE; x++) {
            for (let y = 0; y < World.CHUNK_SIZE; y++) {
                for (let z = 0; z < World.CHUNK_SIZE; z++) {
                    const block = chunk.getBlock(x, y, z);

                    if (block.type === Block.Type.AIR) {
                        continue;
                    }

                    for (const direction of Direction.all()) {
                        const neighbor = chunk.getBlock(x + direction.x, y + direction.y, z + direction.z);
                        const neighborIsSameType = block.type === neighbor.type;

                        if (!Block.isOpaque(neighbor) && !neighborIsSameType) {
                            const index = vertices.length / 3;
                            const face = Cube.Face.direction(direction);
                            let textureIndex = block.getTextureIndex(direction);

                            for (const corner of face.corners) {
                                vertices.push(corner.x + block.x, corner.y + block.y, corner.z + block.z);

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

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
        geometry.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
        geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
        geometry.setIndex(indices);

        return new Mesh(geometry, material);
    }
}

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
