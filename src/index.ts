import 'normalize.css';
import './assets/styles/index.scss';
import { AmbientLight } from './scripts/Entities/AmbientLight';
import { DirectionalLight } from './scripts/Entities/DirectionalLight';
import { MeshEntity } from './scripts/Entities/MeshEntity';
import { Game } from './scripts/Game/Game';
import { FrameRatePrinter } from './scripts/Systems/FrameRatePrinter';
import { RenderSystem } from './scripts/Systems/RenderSystem';
import { Coordinate3, MeshData } from './scripts/Util/Math';
import { Chunk, ChunkData } from './scripts/WorldGen/Chunk';
import { World } from './scripts/WorldGen/World';

const drawDistance = 5;
const world = new World();
const worldCenter = drawDistance * Chunk.SIZE / 2;

const game = new Game();
game.addSystem(new RenderSystem(worldCenter, 0, worldCenter));
game.addSystem(new FrameRatePrinter());
game.addEntity(new DirectionalLight(worldCenter * 2, 400, worldCenter * 2, 1));
game.addEntity(new AmbientLight(0.2));

const meshWorker = new Worker('./scripts/Worker/ChunkMesherWorker.ts', { type: 'module' });
const chunkWorker = new Worker('./scripts/Worker/ChunkGenerationWorker.ts', { type: 'module' });

meshWorker.onmessage = (event: MessageEvent): void => {
    const { x, y, z }: Coordinate3 = event.data;
    const meshData: MeshData = event.data.meshData;
    const offset = { x: x * Chunk.SIZE, y: y * Chunk.SIZE, z: z * Chunk.SIZE };

    game.addEntity(new MeshEntity(meshData, offset));
};

chunkWorker.onmessage = (event: MessageEvent): void => {
    const { x, y, z }: Coordinate3 = event.data;
    const chunkData: ChunkData = event.data.chunkData;
    const chunk = world.getChunk({ x, y, z });

    chunk.data = chunkData;
    meshWorker.postMessage({ x, y, z, chunkData: chunk.data });
};

for (let x = 0; x < drawDistance; x++) {
    for (let z = 0; z < drawDistance; z++) {
        for (let y = 0; y < 3; y++) {
            chunkWorker.postMessage({ x, y, z, chunkData: [] });
        }
    }
}

game.start();
