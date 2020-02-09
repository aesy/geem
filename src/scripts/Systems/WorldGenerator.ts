import { Vector3 } from 'three';
import { Entity } from '../Entities/Entity';
import { MeshEntity } from '../Entities/MeshEntity';
import { Game } from '../Game/Game';
import { Coordinate3, MeshData } from '../Util/Math';
import { Chunk, ChunkData } from '../WorldGen/Chunk';
import { World, WorldUtils } from '../WorldGen/World';
import { System } from './System';

const up = new Vector3(0, 1, 0);

export class WorldGenerator extends System {
    private readonly meshWorker = new Worker('../Worker/ChunkMesherWorker.ts',
        { name: 'MeshWorker', type: 'module' });
    private readonly chunkWorker = new Worker('../Worker/ChunkGenerationWorker.ts',
        { name: 'ChunkWorker', type: 'module' });

    private readonly chunkEntityMapping = new Map<Chunk, Entity>();
    private readonly unprocessed: Entity[] = [];
    private readonly active: Coordinate3[] = [];

    public constructor(
        private readonly world: World,
        private readonly drawDistance: number,
        private readonly moving: boolean = false
    ) {
        super();

        this.chunkWorker.onmessage = this.onNewChunk.bind(this);
        this.meshWorker.onmessage = this.onNewMesh.bind(this);
    }

    public update(dt: number, entities: Entity[], game: Game): void {
        while (this.unprocessed.length) {
            const entity = this.unprocessed.pop();

            game.addEntity(entity!);
        }

        const { x, y, z } = WorldUtils.worldToChunk(game.camera.position);

        const maxY = 2;

        if (y > maxY || y < 0) {
            return;
        }

        if (this.active.length < Math.pow(this.drawDistance * 2, 2) * maxY) {
            for (let xn = -this.drawDistance; xn <= this.drawDistance; xn++) {
                for (let zn = -this.drawDistance; zn <= this.drawDistance; zn++) {
                    for (let yn = -y; yn <= 0; yn++) {
                        const ax = x + xn;
                        const ay = y + yn;
                        const az = z + zn;

                        let generated = false;

                        for (const position of this.active) {
                            if (position.x === ax && position.y === ay && position.z === az) {
                                generated = true;
                                break;
                            }
                        }

                        if (!generated) {
                            this.active.push({ x: ax, y: ay, z: az });

                            setTimeout(() => {
                                this.chunkWorker.postMessage({ x: ax, y: ay, z: az, chunkData: [] });
                            }, 0);
                        }
                    }
                }
            }
        } else {
            const toBeRemoved: Coordinate3[] = [];

            for (const pos of this.active) {
                if ((Math.abs(pos.x - x) > this.drawDistance) ||
                    (Math.abs(pos.z - z) > this.drawDistance)) {
                    const chunk = this.world.getChunk(pos);
                    const entity = this.chunkEntityMapping.get(chunk);

                    if (entity) {
                        console.log(`Unloading chunk: x: ${ pos.x }, y: ${ pos.y }, z: ${ pos.z }`);

                        game.removeEntity(entity);

                        this.chunkEntityMapping.delete(chunk);
                        toBeRemoved.push(pos);
                    }
                }
            }

            while (toBeRemoved.length) {
                const coord = toBeRemoved.pop();
                const index = this.active.indexOf(coord!);

                this.active.splice(index, 1);
            }
        }

        if (this.moving) {
            game.camera.position.x += dt * 20;
            game.camera.rotateOnWorldAxis(up, dt * Math.PI / 2 / 5);
        }
    }

    private onNewMesh(event: MessageEvent): void {
        const { x, y, z }: Coordinate3 = event.data;
        const meshData: MeshData = event.data.meshData;
        const offset = { x: x * Chunk.SIZE, y: y * Chunk.SIZE, z: z * Chunk.SIZE };
        const chunk = this.world.getChunk({ x, y, z });
        const entity = new MeshEntity(meshData, offset);

        this.chunkEntityMapping.set(chunk, entity);
        this.unprocessed.push(entity);
    }

    private onNewChunk(event: MessageEvent): void {
        const { x, y, z }: Coordinate3 = event.data;
        const chunkData: ChunkData = event.data.chunkData;
        const chunk = this.world.getChunk({ x, y, z });

        chunk.data = chunkData;

        setTimeout(() => {
            this.meshWorker.postMessage({ x, y, z, chunkData: chunk.data });
        }, 0);
    }
}
