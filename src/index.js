import 'normalize.css';
import './assets/styles/index.scss';
import Example from './scripts/Entities/Example';
import Game from './scripts/Game/Game';
import RenderSystem from './scripts/Systems/RenderSystem';
import FrameRatePrinter from './scripts/Systems/FrameRatePrinter';
import Horse from './scripts/Entities/Horse';
import PointLight from './scripts/Entities/PointLight';

const game = new Game();
game.addSystem(new RenderSystem());
game.addSystem(new FrameRatePrinter());
game.addEntity(new Example());
game.addEntity(new Horse());
game.addEntity(new PointLight());
game.start();
