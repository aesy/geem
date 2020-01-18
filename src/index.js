import 'normalize.css';

const entities = [];
const systems = [];

function update(dt) {
    for (const system of systems) {
        const filteredEntities = entities.filter(system.appliesTo);
        system.update(dt, filteredEntities);
    }
}
