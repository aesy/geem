import 'normalize.css';
import './assets/styles/index.scss';
import { Game } from './scripts/Game/Game';
import { WebGL } from './scripts/Renderer/Canvas';
import { WebGLForwardRenderer } from './scripts/Renderer/Renderer';
import { ChunkLoader } from './scripts/Systems/ChunkLoader';
import { ChunkUpdater } from './scripts/Systems/ChunkUpdater';
import { FrameRateCounter } from './scripts/Systems/FrameRateCounter';
import { World } from './scripts/WorldGen/World';
import { Player } from './scripts/Entities/Player';

const drawDistance = 1;
const world = new World();

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = WebGL.getWebGLContext(canvas);
const renderer = new WebGLForwardRenderer(context);

const game = new Game(renderer);
game.addEntity(new Player());
game.addSystem(new FrameRateCounter());
game.addSystem(new ChunkLoader(world, drawDistance));
game.addSystem(new ChunkUpdater(world));

game.start();
