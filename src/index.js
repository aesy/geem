import 'normalize.css';
import './assets/styles/index.scss';
import Game from './scripts/Game/Game';
import FloatSystem from './scripts/Systems/FloatSystem';
import RenderSystem from './scripts/Systems/RenderSystem';
import FrameRatePrinter from './scripts/Systems/FrameRatePrinter';
import PointLight from './scripts/Entities/PointLight';
import RotateSystem from './scripts/Systems/RotateSystem';
import Grid from './scripts/Entities/Grid';
import { generateWorld } from './scripts/WorldGen/randomWorld';
import AmbientLight from './scripts/Entities/AmbientLight';

const game = new Game();
game.addSystem(new RenderSystem());
game.addSystem(new FloatSystem());
// game.addSystem(new FrameRatePrinter());
// game.addSystem(new RotateSystem());
// game.addEntity(new Grid());
// game.addEntity(new PointLight());
game.addEntity(new AmbientLight());

for (const tile of generateWorld(60, 60, .2, 30, 14)) {
    game.addEntity(tile);
}

game.start();
