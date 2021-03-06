import { Coordinate3 } from '../Util/Math';
import { Block } from './Block';
import { Chunk } from './Chunk';

export type WorldData = (Chunk | undefined)[];

export class WorldUtils {
    private constructor() {}

    public static worldToChunk(pos: Coordinate3): Coordinate3 {
        const x = Math.floor(pos.x / Chunk.SIZE);
        const y = Math.floor(pos.y / Chunk.SIZE);
        const z = Math.floor(pos.z / Chunk.SIZE);

        return { x, y, z };
    }

    public static worldToBlock(pos: Coordinate3): Coordinate3 {
        const x = Math.floor(pos.x);
        const y = Math.floor(pos.y);
        const z = Math.floor(pos.z);

        return { x, y, z };
    }
}

export class World {
    private readonly octant1: WorldData = []; // +x, +y, +z
    private readonly octant2: WorldData = []; // -x, +y, +z
    private readonly octant3: WorldData = []; // +x, -y, +z
    private readonly octant4: WorldData = []; // -x, -y, +z
    private readonly octant5: WorldData = []; // +x, +y, -z
    private readonly octant6: WorldData = []; // -x, +y, -z
    private readonly octant7: WorldData = []; // +x, -y, -z
    private readonly octant8: WorldData = []; // -x, -y, -z

    public getChunk(pos: Coordinate3): Chunk {
        const octant = this.getOctant(pos);
        const index = this.getIndex(pos);
        let chunk = octant[ index ];

        if (!chunk) {
            chunk = new Chunk(pos, this, []);
            octant[ index ] = chunk;
        }

        return chunk;
    }

    public clearChunk(pos: Coordinate3): void {
        const octant = this.getOctant(pos);
        const index = this.getIndex(pos);

        octant[ index ] = undefined;
    }

    public setBlock(pos: Coordinate3, block: Block): void {
        const chunkPos = WorldUtils.worldToChunk(pos);
        const blockX = pos.x - chunkPos.x * Chunk.SIZE;
        const blockY = pos.y - chunkPos.y * Chunk.SIZE;
        const blockZ = pos.z - chunkPos.z * Chunk.SIZE;
        const chunk = this.getChunk(chunkPos);

        chunk.setBlock({ x: blockX, y: blockY, z: blockZ }, block);
    }

    public getBlock(pos: Coordinate3): Block {
        const chunkPos = WorldUtils.worldToChunk(pos);
        const blockX = pos.x - chunkPos.x * Chunk.SIZE;
        const blockY = pos.y - chunkPos.y * Chunk.SIZE;
        const blockZ = pos.z - chunkPos.z * Chunk.SIZE;
        const chunk = this.getChunk(chunkPos);

        return chunk.getBlock({ x: blockX, y: blockY, z: blockZ });
    }

    private getOctant(pos: Coordinate3): WorldData {
        const positiveX = pos.x >= 0;
        const positiveY = pos.y >= 0;
        const positiveZ = pos.z >= 0;
        let chunks;

        if (positiveX && positiveY && positiveZ) {
            chunks = this.octant1;
        } else if (!positiveX && positiveY && positiveZ) {
            chunks = this.octant2;
        } else if (positiveX && !positiveY && positiveZ) {
            chunks = this.octant3;
        } else if (!positiveX && !positiveY && positiveZ) {
            chunks = this.octant4;
        } else if (positiveX && positiveY && !positiveZ) {
            chunks = this.octant5;
        } else if (!positiveX && positiveY && !positiveZ) {
            chunks = this.octant6;
        } else if (positiveX && !positiveY && !positiveZ) {
            chunks = this.octant7;
        } else if (!positiveX && !positiveY && !positiveZ) {
            chunks = this.octant8;
        } else {
            throw `Trying to get a chunk in unknown octant (x: ${ pos.x }, y: ${ pos.y },z: ${ pos.z }), this should not happen.`;
        }

        return chunks;
    }

    private getIndex(pos: Coordinate3): number {
        return Math.abs(pos.x) + Math.abs(pos.y) * Chunk.SIZE + Math.abs(pos.z) * Chunk.SIZE_SQUARED;
    }
}
