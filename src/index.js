import 'normalize.css';
import FrameRatePrinter from './scripts/Systems/FrameRatePrinter';
import { Scene, OrthographicCamera, WebGLRenderer, MeshLambertMaterial, SphereGeometry, Mesh, PointLight } from 'three';

const entities = [];
const systems = [
    new FrameRatePrinter()
];

const { innerHeight, innerWidth } = window;
const scene = new Scene();
const camera = new OrthographicCamera(innerWidth / -10, innerWidth / 10, innerHeight / 10, innerHeight / -10, 0, 1000);
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

renderer.setClearColor(0x222222);
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

let lastTimestamp = 0;

function update(currentTimestamp) {
    const dt = (currentTimestamp - lastTimestamp) / 1000;
    lastTimestamp = currentTimestamp;

    for (const system of systems) {
        const filteredEntities = entities.filter(system.appliesTo);
        system.update(dt, filteredEntities);
    }

    renderer.render(scene, camera);

    requestAnimationFrame(update);
}

function onResize() {
    const { innerHeight, innerWidth } = window;

    renderer.setSize(innerWidth, innerHeight);

    camera.left = innerWidth / -10;
    camera.right = innerWidth / 10;
    camera.top = innerHeight / 10;
    camera.bottom = innerHeight / -10;
    camera.updateProjectionMatrix();
}

addEventListener('resize', onResize);

requestAnimationFrame(update);