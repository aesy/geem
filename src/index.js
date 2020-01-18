import 'normalize.css';
import FrameRatePrinter from './scripts/Systems/FrameRatePrinter';

const entities = [];
const systems = [
    new FrameRatePrinter()
];

let lastTimestamp = 0;

function update(currentTimestamp) {
    const dt = (currentTimestamp - lastTimestamp) / 1000;
    lastTimestamp = currentTimestamp;

    for (const system of systems) {
        const filteredEntities = entities.filter(system.appliesTo);
        system.update(dt, filteredEntities);
    }

    window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
