export default class Game {
    constructor() {
        this.entities = [];
        this.systems = [];
        this.lastTimestamp = 0;
    }

    addSystem(system) {
        this.systems.push(system);
    }

    addEntity(entity) {
        this.entities.push(entity);
    }

    start() {
        requestAnimationFrame(this.update.bind(this));
    }

    update(currentTimestamp) {
        const dt = (currentTimestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = currentTimestamp;

        for (const system of this.systems) {
            const filteredEntities = this.entities.filter(system.appliesTo);

            system.update(dt, filteredEntities);
        }

        requestAnimationFrame(this.update.bind(this));
    }
}
