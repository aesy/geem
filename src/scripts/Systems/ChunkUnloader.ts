import { ChunkMesh } from '../Entities/ChunkMesh';
import { Entity } from '../Entities/Entity';
import { ChunkUnloaded } from '../Event/ChunkUnloaded';
import { Game } from '../Game/Game';
import { World, WorldUtils } from '../WorldGen/World';
import { System } from './System';

export class ChunkUnloader extends System {
    private static readonly INTERVAL_SECONDS = 0.5;

    private elapsedTime = 0;

    public constructor(
        private readonly world: World,
        private readonly maxDistance: number = 1
    ) {
        super();
    }

    public appliesTo(entity: Entity): boolean {
        return entity instanceof ChunkMesh;
    }

    public update(dt: number, entities: Entity[], game: Game): void {
        this.elapsedTime += dt;

        if (this.elapsedTime > ChunkUnloader.INTERVAL_SECONDS) {
            this.elapsedTime = 0;
        } else {
            return;
        }

        // TODO only run whenever player has moved x amount of blocks
        // TODO load based on player rather than camera
        const cameraPosition = WorldUtils.worldToChunk(game.camera.position);
        const chunks = entities.map(entity => (entity as ChunkMesh).chunk);

        for (const chunk of chunks) {
            if (Math.abs(chunk.x - cameraPosition.x) > this.maxDistance ||
                Math.abs(chunk.y - cameraPosition.y) > this.maxDistance ||
                Math.abs(chunk.z - cameraPosition.z) > this.maxDistance
            ) {
                this.world.clearChunk(chunk);
                game.events.emit(new ChunkUnloaded(chunk));
            }
        }
    }
}
