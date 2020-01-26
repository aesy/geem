import 'normalize.css';
import './assets/styles/index.scss';
import {
    BoxGeometry,
    DirectionalLight,
    DirectionalLightHelper,
    HemisphereLight,
    LineBasicMaterial,
    LineSegments,
    Mesh,
    MeshBasicMaterial,
    WireframeGeometry
} from 'three';
import Renderer from './scripts/Experiment/Renderer';
import World from './scripts/Experiment/World';

const drawDistance = 5;
const world = new World();

const renderer = new Renderer();
const worldCenter = drawDistance * World.CHUNK_SIZE / 2;
renderer.controls.target.set(worldCenter, 0, worldCenter);
renderer.camera.lookAt(worldCenter, 0, worldCenter);

const hemiLight = new HemisphereLight(0x0000ff, 0x00ff00, 0.5);
renderer.scene.add(hemiLight);

const light = new DirectionalLight(0xFFFFFF, 2);
light.castShadow = true;
light.shadow.mapSize.set(2048, 2048);
light.shadow.camera.left = -300;
light.shadow.camera.right = 300;
light.shadow.camera.top = 300;
light.shadow.camera.bottom = -300;
light.shadow.camera.far = 3500;
light.shadow.bias = -0.0001;
light.position.set(worldCenter * 2, 200, worldCenter * 2);
renderer.scene.add(light);

const lightHelper = new DirectionalLightHelper(light);
renderer.scene.add(lightHelper);

const referenceBox = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 'blue' }));
referenceBox.position.y += 0.5;
renderer.scene.add(referenceBox);

for (let x = 0; x < drawDistance; x++) {
    for (let z = 0; z < drawDistance; z++) {
        const chunk = world.getChunk(x, 0, z);
        const mesh = chunk.getMesh();
        mesh.castShadow = true;
        mesh.receiveShadow = true;
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
