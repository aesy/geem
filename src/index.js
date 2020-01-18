import 'normalize.css';
import FrameRatePrinter from './scripts/Systems/FrameRatePrinter';
import { Scene, OrthographicCamera, WebGLRenderer, MeshLambertMaterial, SphereGeometry, Mesh, PointLight } from 'three';

const entities = [];
const systems = [
    new FrameRatePrinter()
];

const scene = new Scene();
const camera = new OrthographicCamera(window.innerWidth / -10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / -10, 0, 1000);
const renderer = new WebGLRenderer();

const material = new MeshLambertMaterial({color: 0xFF00FF});
const geometry = new SphereGeometry(5, 32, 32);
const mesh = new Mesh(geometry, material);

const light = new PointLight(0xFFFF00, 10, 100);
const light2 = new PointLight(0x0000FF, 10, 100);

light.position.set(50,50,50);
light2.position.set(-50, -50, 0);

scene.add(light2);
scene.add(light);
scene.add(mesh);
camera.position.z = 20;

renderer.setClearColor(0xdddddd);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let lastTimestamp = 0;

function update(currentTimestamp) {
    const dt = (currentTimestamp - lastTimestamp) / 1000;
    lastTimestamp = currentTimestamp;

    for (const system of systems) {
        const filteredEntities = entities.filter(system.appliesTo);
        system.update(dt, filteredEntities);
    }

    mesh.position.x += 1;

    renderer.render(scene, camera);
    requestAnimationFrame(update);
}

requestAnimationFrame(update);