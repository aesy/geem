import 'normalize.css';
import './assets/styles/index.scss';
import Example from './scripts/Entities/Example';
import Game from './scripts/Game/Game';
import RenderSystem from './scripts/Systems/RenderSystem';
import FrameRatePrinter from './scripts/Systems/FrameRatePrinter';

const game = new Game();
game.addSystem(new RenderSystem());
game.addSystem(new FrameRatePrinter());
game.addEntity(new Example());
game.start();
