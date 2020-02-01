import {
    Object3D,
    Scene,
    WebGLRenderer,
    PerspectiveCamera,
    VSMShadowMap
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import System from './System.js';

export default class RenderSystem extends System {
    constructor(cameraTargetX, cameraTargetY, cameraTargetZ) {
        super();
        const { innerHeight, innerWidth } = window;

        const scene = new Scene();

        const renderer = new WebGLRenderer({ antialias: true });
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = VSMShadowMap;
        renderer.setClearColor(0x5D95A9);
        renderer.setSize(innerWidth, innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);
        addEventListener('resize', this.onResize.bind(this));

        const camera = new PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 1000);
        // const camera = new OrthographicCamera(innerWidth / -10, innerWidth / 10, innerHeight / 10, innerHeight / -10, 0, 1000);
        camera.position.set(0, 60, 0);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(cameraTargetX, cameraTargetY, cameraTargetZ);
        camera.lookAt(cameraTargetX, cameraTargetY, cameraTargetZ);

        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.controls = controls;
    }
    
    appliesTo(entity) {
        return entity.hasComponent(Object3D);
    }

    update(dt, entities) {
        for (const entity of entities) {
            const object = entity.getComponent(Object3D);
            
            this.scene.add(object);
        }

        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        const { innerHeight, innerWidth } = window;

        this.renderer.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth / innerHeight;

        // this.camera.left = innerWidth / -10;
        // this.camera.right = innerWidth / 10;
        // this.camera.top = innerHeight / 10;
        // this.camera.bottom = innerHeight / -10;

        this.camera.updateProjectionMatrix();
    }
}