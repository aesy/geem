import { PerspectiveCamera, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Entity } from '../Entities/Entity';
import { EntityAdded } from '../Event/EntityAdded';
import { EntityRemoved } from '../Event/EntityRemoved';
import { EventBus } from '../Event/EventBus';
import { System } from '../Systems/System';

export class Game {
    public readonly events = new EventBus();
    public readonly camera: PerspectiveCamera;
    public readonly controls: OrbitControls;

    private readonly entities: Entity[] = [];
    private readonly systems: System[] = [];
    private lastTimestamp = 0;

    public constructor(
        private readonly renderer: WebGLRenderer
    ) {
        const camera = new PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 1000);
        // const camera = new OrthographicCamera(innerWidth / -10, innerWidth / 10, innerHeight / 10, innerHeight / -10, 0, 1000);
        const controls = new OrbitControls(camera, renderer.domElement);

        addEventListener('resize', this.onResize.bind(this));

        this.camera = camera;
        this.controls = controls;
    }

    public addSystem(system: System): void {
        this.systems.push(system);
        system.initialize(this);
    }

    public addEntity(entity: Entity): void {
        this.entities.push(entity);
        this.events.emit(new EntityAdded(entity));
    }

    public removeEntity(entity: Entity): void {
        const index = this.entities.indexOf(entity);

        if (index >= 0) {
            this.entities.splice(index, 1);
            this.events.emit(new EntityRemoved(entity));
        }
    }

    public start(): void {
        requestAnimationFrame(this.update.bind(this));
    }

    public update(currentTimestamp: number): void {
        const dt = (currentTimestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = currentTimestamp;
        this.controls.update();

        for (const system of this.systems) {
            const filteredEntities = this.entities.filter(system.appliesTo);

            system.update(dt, filteredEntities, this);
        }

        requestAnimationFrame(this.update.bind(this));
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
