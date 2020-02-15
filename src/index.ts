import 'normalize.css';
import './assets/styles/index.scss';
import { AmbientLight } from './scripts/Entities/AmbientLight';
import { DirectionalLight } from './scripts/Entities/DirectionalLight';
import { Game } from './scripts/Game/Game';
import { ChunkUpdater } from './scripts/Systems/ChunkUpdater';
import { DigSystem } from './scripts/Systems/DigSystem';
import { RenderSystem } from './scripts/Systems/RenderSystem';
import { WorldLoader } from './scripts/Systems/WorldLoader';
import { WorldUnloader } from './scripts/Systems/WorldUnloader';
import { Chunk } from './scripts/WorldGen/Chunk';
import { AsyncChunkDataGeneratorScheduler } from './scripts/WorldGen/ChunkGeneratorScheduler';
import { AsyncChunkMeshGeneratorScheduler } from './scripts/WorldGen/ChunkMeshGeneratorScheduler';
import { DEFAULT_CHUNK_GENERATOR, DEFAULT_CHUNK_MESHER } from './scripts/WorldGen/Defaults';
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

const dataScheduler = new AsyncChunkDataGeneratorScheduler(DEFAULT_CHUNK_GENERATOR, -1, 2);
const meshScheduler = new AsyncChunkMeshGeneratorScheduler(DEFAULT_CHUNK_MESHER, -1, 1);

const renderSystem = new RenderSystem();

const game = new Game(renderSystem.renderer);
game.addSystem(renderSystem);
game.addSystem(new ControlSystem(world));
game.addSystem(new GravitySystem(world));
game.addSystem(new VelocitySystem(world));
game.addSystem(new TerrainCollisionSystem(world));
game.addSystem(new CameraFollowSystem());
game.addSystem(new DigSystem(world));
game.addSystem(new WorldLoader(world, dataScheduler, drawDistance));
game.addSystem(new WorldUnloader(world, drawDistance + 1));
game.addSystem(new ChunkUpdater(world, meshScheduler));
game.addEntity(new DirectionalLight(worldCenter * 2, 400, worldCenter * 2, 1));
game.addEntity(new AmbientLight(0.2));
game.addEntity(new Player());
game.addSystem(renderSystem);

game.start();
