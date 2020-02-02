import 'normalize.css';
import './assets/styles/index.scss';
import DirectionalLight from './scripts/Entities/DirectionalLight';
import Terrain from './scripts/Entities/Terrain';
import Water from './scripts/Entities/Water';
import Game from './scripts/Game/Game';
import FrameRatePrinter from './scripts/Systems/FrameRatePrinter';
import RenderSystem from './scripts/Systems/RenderSystem';
import World from './scripts/WorldGen/World';

const drawDistance = 5;
const world = new World();
const worldCenter = drawDistance * World.CHUNK_SIZE / 2;

const game = new Game();
game.addSystem(new RenderSystem(worldCenter, 0, worldCenter));
game.addSystem(new FrameRatePrinter());
game.addEntity(new DirectionalLight(worldCenter * 2, 200, worldCenter * 2));

for (let x = 0; x < drawDistance; x++) {
    for (let z = 0; z < drawDistance; z++) {
        for (let y = 0; y < 3; y++) {
            setTimeout(() => {
                const chunk = world.getChunk(x, y, z);

                game.addEntity(new Terrain(chunk));
                game.addEntity(new Water(chunk));
            }, 0);
        }
    }
}

game.start();
