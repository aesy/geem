import 'normalize.css';
import './assets/styles/index.scss';
import FrameRatePrinter from './scripts/Systems/FrameRatePrinter';
import RenderSystem from './scripts/Systems/RenderSystem';
import Example from './scripts/Entities/Example';

const entities = [
    new Example(),
];
const systems = [
    new FrameRatePrinter(),
    new RenderSystem(),
];

let lastTimestamp = 0;

function update(currentTimestamp) {
    const dt = (currentTimestamp - lastTimestamp) / 1000;
    lastTimestamp = currentTimestamp;

    for (const system of systems) {
        const filteredEntities = entities.filter(system.appliesTo);
        system.update(dt, filteredEntities);
    }


    requestAnimationFrame(update);
}

requestAnimationFrame(update);