import 'normalize.css';
import './assets/styles/index.scss';
import {
    BoxGeometry,
    DirectionalLight,
    DirectionalLightHelper,
    HemisphereLight,
    Mesh,
    MeshBasicMaterial,
    Raycaster
} from 'three';
import { Block } from './scripts/Experiment/Block';
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
        setTimeout(() => {
            const chunk = world.getChunk(x, 0, z);
            const mesh = chunk.getMesh();
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            renderer.scene.add(mesh);
        }, 0);
    }
}

function onClick(event) {
    const { innerHeight, innerWidth } = window;
    const x = (event.clientX / innerWidth) * 2 - 1;
    const y = -(event.clientY / innerHeight) * 2 + 1;
    const raycaster = new Raycaster();
    raycaster.setFromCamera({ x, y }, renderer.camera);
    const intersects = raycaster.intersectObjects(renderer.scene.children);

    for (const intersect of intersects) {
        // HACK move intersection point slightly in the direction of the ray to ensure the point is inside the block
        const x = Math.floor(intersect.point.x + raycaster.ray.direction.x / 100);
        const y = Math.floor(intersect.point.y + raycaster.ray.direction.y / 100);
        const z = Math.floor(intersect.point.z + raycaster.ray.direction.z / 100);
        const chunkX = Math.floor(x / World.CHUNK_SIZE);
        const chunkY = Math.floor(y / World.CHUNK_SIZE);
        const chunkZ = Math.floor(z / World.CHUNK_SIZE);
        const blockX = x - chunkX * World.CHUNK_SIZE;
        const blockY = y - chunkY * World.CHUNK_SIZE;
        const blockZ = z - chunkZ * World.CHUNK_SIZE;
        const chunk = world.getChunk(chunkX, chunkY, chunkZ);
        const oldMesh = chunk.getMesh();
        renderer.scene.remove(oldMesh);

        chunk.setBlock(blockX, blockY, blockZ, Block.Type.AIR);

        const newMesh = chunk.getMesh();
        newMesh.castShadow = true;
        newMesh.receiveShadow = true;
        renderer.scene.add(newMesh);
    }
}

function render() {
    renderer.update();
    requestAnimationFrame(render);
}

addEventListener('click', onClick);
requestAnimationFrame(render);
