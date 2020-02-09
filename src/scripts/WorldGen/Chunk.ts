import { Coordinate3, MeshData } from '../Util/Math';
import { Block, BlockType, PositionedBlock } from './Block';
import { World } from './World';

export type ChunkData = Block[];

export interface ChunkGenerator {
    generateChunk(chunk: Chunk): void;
}

export interface ChunkMesher {
    createMesh(chunk: Chunk): MeshData;
}

export class ChunkUtils {
    private constructor() {}

    public static applyTemplate(chunk: Chunk, origin: Coordinate3, template: PositionedBlock[]): void {
        for (const block of template) {
            const pos = { x: origin.x + block.x, y: origin.y + block.y, z: origin.z + block.z };

            chunk.setBlock(pos, { type: block.type });
        }
    }
}

export class Chunk {
    public static readonly SIZE = 32;
    public static readonly SIZE_SQUARED = Chunk.SIZE * Chunk.SIZE;

    public constructor(
        private readonly position: Coordinate3,
        private readonly world: World | null,
        public data: ChunkData // TODO this shouldn't really be public and/or mutable
    ) {}

    public get x(): number {
        return this.position.x;
    }

    public get y(): number {
        return this.position.y;
    }

    public get z(): number {
        return this.position.z;
    }

    public setBlock(pos: Coordinate3, block: Block): void {
        if (pos.x < 0 || pos.x >= Chunk.SIZE || pos.y < 0 || pos.y >= Chunk.SIZE || pos.z < 0 || pos.z >= Chunk.SIZE) {
            if (this.world) {
                // Outside the chunk, need to set in the world... should we?
                // this.world.setBlock(...);
            }

            return;
        }

        this.data[ pos.x + pos.y * Chunk.SIZE + pos.z * Chunk.SIZE_SQUARED ] = block;
    }

    public getBlock(pos: Coordinate3): Block {
        if (pos.x < 0 || pos.x >= Chunk.SIZE || pos.y < 0 || pos.y >= Chunk.SIZE || pos.z < 0 || pos.z >= Chunk.SIZE) {
            if (!this.world) {
                return { type: BlockType.AIR };
                // throw `Not able to get blocks outside of chunk bounding area (x: ${ pos.x }, y: ${ pos.y }, z: ${ pos.z })`;
            }

            const xOffset = this.position.x * Chunk.SIZE;
            const yOffset = this.position.y * Chunk.SIZE;
            const zOffset = this.position.z * Chunk.SIZE;

            return this.world.getBlock({ x: pos.x + xOffset, y: pos.y + yOffset, z: pos.z + zOffset });
        }

        const index = pos.x + pos.y * Chunk.SIZE + pos.z * Chunk.SIZE_SQUARED;

        return this.data[ index ];
    }
}
