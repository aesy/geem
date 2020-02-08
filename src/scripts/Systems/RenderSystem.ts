import {
    Object3D,
    Scene,
    WebGLRenderer,
    PerspectiveCamera,
    VSMShadowMap,
    Renderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Entity } from '../Entities/Entity';
import { System } from './System';

export class RenderSystem extends System {
    private readonly scene: Scene;
    private readonly renderer: Renderer;
    private readonly camera: PerspectiveCamera;
    private readonly controls: OrbitControls;

    public constructor(cameraTargetX: number, cameraTargetY: number, cameraTargetZ: number) {
        super();

        const { innerHeight, innerWidth } = window;

        const scene = new Scene();

        const renderer = new WebGLRenderer();
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = VSMShadowMap;
        renderer.setClearColor(0x5D95A9);
        renderer.setSize(innerWidth, innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);
        addEventListener('resize', this.onResize.bind(this));

        const camera = new PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 1000);
        // const camera = new OrthographicCamera(innerWidth / -10, innerWidth / 10, innerHeight / 10, innerHeight /
        // -10, 0, 1000);
        camera.position.set(0, 60, 0);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(cameraTargetX, cameraTargetY, cameraTargetZ);
        camera.lookAt(cameraTargetX, cameraTargetY, cameraTargetZ);

        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.controls = controls;
    }

    public appliesTo(entity: Entity): boolean {
        return entity.hasComponent(Object3D);
    }

    public update(dt: number, entities: Entity[]): void {
        for (const entity of entities) {
            const object = entity.getComponent(Object3D);

            this.scene.add(object);
        }

        this.renderer.render(this.scene, this.camera);
    }

    private onResize(): void {
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
