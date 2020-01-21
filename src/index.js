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

const game = new Game();
game.addSystem(new RenderSystem());
game.addSystem(new FloatSystem());
game.addSystem(new FrameRatePrinter());
game.addSystem(new RotateSystem());
game.addEntity(new Grid());
game.addEntity(new PointLight());

for (const waterTile of generateWorld(10, 10)) {
    game.addEntity(waterTile);
}

game.start();
