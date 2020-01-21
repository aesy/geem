import EntityAdded from '../Event/EntityAdded';
import EventBus from '../Event/EventBus';

export default class Game {
    constructor() {
        this.entities = [];
        this.systems = [];
        this.lastTimestamp = 0;
        this.events = new EventBus();
    }

    addSystem(system) {
        this.systems.push(system);
        system.initialize(this.events);
    }

    addEntity(entity) {
        this.entities.push(entity);
        this.events.emit(new EntityAdded(entity));
    }

    start() {
        requestAnimationFrame(this.update.bind(this));
    }

    update(currentTimestamp) {
        const dt = (currentTimestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = currentTimestamp;

        for (const system of this.systems) {
            const filteredEntities = this.entities.filter(system.appliesTo);

            system.update(dt, filteredEntities, this.events);
        }

        requestAnimationFrame(this.update.bind(this));
    }
}
