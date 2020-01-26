import { Scene, WebGLRenderer, PerspectiveCamera, PCFSoftShadowMap } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Renderer {
    constructor() {
        const { innerHeight, innerWidth } = window;

        const scene = new Scene();

        const renderer = new WebGLRenderer({ antialias: true });
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = PCFSoftShadowMap;
        renderer.setClearColor(0x5D95A9);
        renderer.setSize(innerWidth, innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);
        addEventListener('resize', this.onResize.bind(this));

        const camera = new PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 1000);
        camera.position.set(0, 60, 0);

        const controls = new OrbitControls(camera, renderer.domElement);

        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.controls = controls;
    }

    update() {
        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        const { innerHeight, innerWidth } = window;

        this.renderer.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
    }
}
