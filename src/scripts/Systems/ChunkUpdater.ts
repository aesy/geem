import { ChunkEntity } from '../Entities/ChunkEntity';
import { Entity } from '../Entities/Entity';
import { BlockRemoved } from '../Event/BlockRemoved';
import { ChunkLoaded } from '../Event/ChunkLoaded';
import { ChunkUnloaded } from '../Event/ChunkUnloaded';
import { Game } from '../Game/Game';
import { Chunk } from '../WorldGen/Chunk';
import { ChunkMeshGeneratorScheduler } from '../WorldGen/ChunkMeshGeneratorScheduler';
import { World, WorldUtils } from '../WorldGen/World';
import { System } from './System';

// TODO move schedulers here
// TODO use scheduler implementation based on urgency (instant for deleted blocks)

export class ChunkUpdater extends System {
    private readonly chunkEntities: Map<Chunk, Entity>;
    private readonly toBeMeshed: Chunk[];
    private readonly toBeRemoved: Chunk[];
    private dirty: boolean;

    public constructor(
        private readonly world: World,
        private readonly scheduler: ChunkMeshGeneratorScheduler
    ) {
        super();

        this.chunkEntities = new Map();
        this.toBeMeshed = [];
        this.toBeRemoved = [];
        this.dirty = false;
    }

    public initialize(game: Game): void {
        game.events.register(BlockRemoved, this.onBlockDeleted.bind(this));
        game.events.register(ChunkLoaded, this.onChunkLoaded.bind(this));
        game.events.register(ChunkUnloaded, this.onChunkUnloaded.bind(this));
    }

    public update(dt: number, entities: Entity[], game: Game): void {
        if (!this.dirty) {
            return;
        }

        while (this.toBeMeshed.length) {
            const chunk = this.toBeMeshed.pop()!;

            console.log(`Scheduling update of chunk: x: ${ chunk.x }, y: ${ chunk.y }, z: ${ chunk.z }`);

            this.scheduler.schedule(chunk)
                .then(meshData => {
                    const newEntity = new ChunkEntity(chunk, meshData);
                    const oldEntity = this.chunkEntities.get(chunk);

                    if (oldEntity) {
                        game.removeEntity(oldEntity);
                        game.addEntity(newEntity);
                    } else {
                        game.addEntity(newEntity);
                    }

                    this.chunkEntities.set(chunk, newEntity);
                })
                .catch(console.log);
        }

        while (this.toBeRemoved.length) {
            const chunk = this.toBeRemoved.pop()!;
            const entity = this.chunkEntities.get(chunk);

            if (entity) {
                this.chunkEntities.delete(chunk);
                game.removeEntity(entity);
            } else {
                debugger;
            }
        }

        this.dirty = false;
    }

    private onBlockDeleted(event: BlockRemoved): void {
        // TODO Schedule immediate neighbour chunk as well

        console.log('Block deleted');

        const position = WorldUtils.worldToChunk(event.position);
        const chunk = this.world.getChunk(position);

        if (this.toBeMeshed.includes(chunk)) {
            return;
        }

        this.toBeMeshed.push(chunk);
        this.dirty = true;
    }

    private onChunkLoaded(event: ChunkLoaded): void {
        const chunk = event.chunk;

        console.log('Chunk updated');

        if (this.toBeMeshed.includes(chunk)) {
            return;
        }

        this.toBeMeshed.push(chunk);
        this.dirty = true;
    }

    private onChunkUnloaded(event: ChunkLoaded): void {
        const chunk = event.chunk;

        console.log('Chunk removed');

        if (this.toBeRemoved.includes(chunk)) {
            return;
        }

        this.toBeRemoved.push(chunk);
        this.dirty = true;
    }
}
