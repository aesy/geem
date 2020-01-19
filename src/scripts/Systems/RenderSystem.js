import { Object3D, Scene, WebGLRenderer, OrthographicCamera } from 'three';
import System from './System.js';

export default class RenderSystem extends System {
    constructor() {
        super();
        const { innerHeight, innerWidth } = window;

        this.scene = new Scene();
        this.renderer = new WebGLRenderer();
        this.camera = new OrthographicCamera(innerWidth / -10, innerWidth / 10, innerHeight / 10, innerHeight / -10, 0, 1000);
        this.renderer.setClearColor(0x222222);
        this.renderer.setSize(innerWidth, innerHeight);
        document.body.appendChild(this.renderer.domElement);

        addEventListener('resize', this.onResize.bind(this));
    }
    
    appliesTo(entity) {
        return entity.hasComponent(Object3D);
    }

    update(dt, entities) {
        for (const entity of entities) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    onResize() {
        const { innerHeight, innerWidth } = window;

        this.renderer.setSize(innerWidth, innerHeight);
    
        this.camera.left = innerWidth / -10;
        this.camera.right = innerWidth / 10;
        this.camera.top = innerHeight / 10;
        this.camera.bottom = innerHeight / -10;
        this.camera.updateProjectionMatrix();
    }
}