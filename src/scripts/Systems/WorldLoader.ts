import { Object3D } from 'three';
import { Entity } from '../Entities/Entity';
import { Player } from '../Entities/Player';
import { ChunkLoaded } from '../Event/ChunkLoaded';
import { Game } from '../Game/Game';
import { Coordinate3 } from '../Util/Math';
import { Chunk } from '../WorldGen/Chunk';
import { ChunkGeneratorScheduler } from '../WorldGen/ChunkGeneratorScheduler';
import { World, WorldUtils } from '../WorldGen/World';
import { System } from './System';

type Comparator<T> = (first: T, second: T) => number;

export class WorldLoader extends System {
    private readonly generated: Set<Chunk>;

    public constructor(
        private readonly world: World,
        private readonly dataScheduler: ChunkGeneratorScheduler,
        private readonly drawDistance: number = 1
    ) {
        super();

        this.generated = new Set();
    }

    public appliesTo(entity: Entity): boolean {
        return entity.hasComponents(Player, Object3D);
    }

    // TODO listen to unload events and clear from generated

    public update(dt: number, entities: Entity[], game: Game): void {
        // TODO only run whenever player has moved x amount of blocks
        // TODO load based on player rather than camera
        const cameraPosition = WorldUtils.worldToChunk(game.camera.position);
        const toBeGenerated: Chunk[] = [];

        for (let x = cameraPosition.x - this.drawDistance; x < cameraPosition.x + this.drawDistance + 1; x++) {
            for (let y = cameraPosition.y - this.drawDistance; y < cameraPosition.y + this.drawDistance + 1; y++) {
                for (let z = cameraPosition.z - this.drawDistance; z < cameraPosition.z + this.drawDistance + 1; z++) {
                    const chunk = this.world.getChunk({ x, y, z });

                    if (!this.generated.has(chunk)) {
                        toBeGenerated.push(chunk);
                    }
                }
            }
        }

        toBeGenerated.sort(this.comparator(cameraPosition));

        for (const chunk of toBeGenerated) {
            this.generated.add(chunk);
            console.log('Loading chunk', chunk);

            this.dataScheduler.schedule(chunk)
                .then(() => {
                    game.events.emit(new ChunkLoaded(chunk));
                })
                .catch(console.log);
        }
    }

    private comparator(position: Coordinate3): Comparator<Chunk> {
        return (chunk1: Chunk, chunk2: Chunk): number => {
            return WorldLoader.distanceSquared(chunk1, position) - WorldLoader.distanceSquared(chunk2, position);
        };
    }

    private static distanceSquared(pos1: Coordinate3, pos2: Coordinate3): number {
        return Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2) + Math.pow(pos1.z - pos2.z, 2);
    }
}
