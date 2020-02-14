import 'normalize.css';
import './assets/styles/index.scss';
import { AmbientLight } from './scripts/Entities/AmbientLight';
import { DirectionalLight } from './scripts/Entities/DirectionalLight';
import { Game } from './scripts/Game/Game';
import { FrameRatePrinter } from './scripts/Systems/FrameRatePrinter';
import { RenderSystem } from './scripts/Systems/RenderSystem';
import { WorldGenerator } from './scripts/Systems/WorldGenerator';
import { Chunk } from './scripts/WorldGen/Chunk';
import { World } from './scripts/WorldGen/World';
import { Player } from './scripts/Entities/Player';
import { CameraFollowSystem } from './scripts/Systems/CameraFollowSystem';
import { GravitySystem } from './scripts/Systems/GravitySystem';
import { ControlSystem } from './scripts/Systems/ControlSystem';
import { VelocitySystem } from './scripts/Systems/VelocitySystem';
import { TerrainCollisionSystem } from './scripts/Systems/TerrainCollisionSystem';

const drawDistance = 1;
const world = new World();
const worldCenter = drawDistance * Chunk.SIZE / 2;

const renderSystem = new RenderSystem();

const game = new Game(worldCenter, 0, worldCenter, renderSystem.renderer);
// game.addSystem(new FrameRatePrinter());
game.addSystem(new WorldGenerator(world, drawDistance, false));
game.addSystem(new ControlSystem(world));
game.addSystem(new GravitySystem(world));
game.addSystem(new VelocitySystem(world));
game.addSystem(new TerrainCollisionSystem(world));
game.addSystem(new CameraFollowSystem());
game.addEntity(new DirectionalLight(worldCenter * 2, 400, worldCenter * 2, 1));
game.addEntity(new AmbientLight(0.2));
game.addEntity(new Player());
game.addSystem(renderSystem);

game.start();
