import 'normalize.css';
import './assets/styles/index.scss';
import { DirectionalLight, LineBasicMaterial, LineSegments, WireframeGeometry } from 'three';
import Renderer from './scripts/Renderer';
import World from './scripts/World';

const drawDistance = 5;
const world = new World();

const renderer = new Renderer();
const worldCenter = drawDistance * World.CHUNK_SIZE / 2;
renderer.controls.target.set(worldCenter, 0, worldCenter);
renderer.camera.lookAt(worldCenter, 0, worldCenter);

const light = new DirectionalLight(0xFFFFFF, 1);
light.position.set(-1, 2, 4);
renderer.scene.add(light);

for (let chunkX = 0; chunkX < drawDistance; chunkX++) {
    for (let chunkZ = 0; chunkZ < drawDistance; chunkZ++) {
        const chunk = world.getChunk(chunkX, 0, chunkZ);
        const mesh = world.generateMesh(chunk);
        renderer.scene.add(mesh);

        const wireframe = new LineSegments(
            new WireframeGeometry(mesh.geometry),
            new LineBasicMaterial({ color: 0x555555, linewidth: 1 }));
        mesh.add(wireframe);
    }
}

function render() {
    renderer.update();
    requestAnimationFrame(render);
}

requestAnimationFrame(render);
