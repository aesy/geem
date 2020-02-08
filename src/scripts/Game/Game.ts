import Entity from '../Entities/Entity';
import EntityAdded from '../Event/EntityAdded';
import EventBus from '../Event/EventBus';
import System from '../Systems/System';

export default class Game {
    public events = new EventBus();

    private entities: Entity[] = [];
    private systems: System[] = [];
    private lastTimestamp = 0;

    addSystem(system: System): void {
        this.systems.push(system);
        system.initialize(this.events);
    }

    addEntity(entity: Entity): void {
        this.entities.push(entity);
        this.events.emit(new EntityAdded(entity));
    }

    start(): void {
        requestAnimationFrame(this.update.bind(this));
    }

    update(currentTimestamp: number): void {
        const dt = (currentTimestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = currentTimestamp;

        for (const system of this.systems) {
            const filteredEntities = this.entities.filter(system.appliesTo);

            system.update(dt, filteredEntities, this.events);
        }

        requestAnimationFrame(this.update.bind(this));
    }
}
