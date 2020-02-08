import { Entity } from '../Entities/Entity';
import { EntityAdded } from '../Event/EntityAdded';
import { EventBus } from '../Event/EventBus';
import { System } from '../Systems/System';

export class Game {
    public readonly events = new EventBus();

    private readonly entities: Entity[] = [];
    private readonly systems: System[] = [];
    private lastTimestamp = 0;

    public addSystem(system: System): void {
        this.systems.push(system);
        system.initialize(this.events);
    }

    public addEntity(entity: Entity): void {
        this.entities.push(entity);
        this.events.emit(new EntityAdded(entity));
    }

    public start(): void {
        requestAnimationFrame(this.update.bind(this));
    }

    public update(currentTimestamp: number): void {
        const dt = (currentTimestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = currentTimestamp;

        for (const system of this.systems) {
            const filteredEntities = this.entities.filter(system.appliesTo);

            system.update(dt, filteredEntities, this.events);
        }

        requestAnimationFrame(this.update.bind(this));
    }
}
