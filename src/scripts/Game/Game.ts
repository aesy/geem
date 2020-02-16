import { PerspectiveCamera, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Entity } from '../Entities/Entity';
import { EntityAdded } from '../Event/EntityAdded';
import { EntityRemoved } from '../Event/EntityRemoved';
import { EventBus } from '../Event/EventBus';
import { System } from '../Systems/System';

export class Game {
    private static readonly TIME_STEP = 1 / 60;
    private static readonly MAX_UPDATES_PER_FRAME = 100;

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
        if (!this.running) {
            this.running = true;

            requestAnimationFrame(this.update.bind(this));
        }
    }

    public stop(): void {
        this.lastTimestamp = 0;
        this.running = false;
    }

    public update(currentTimestamp: number): void {
        let updates = 0;
        let dt = (currentTimestamp - this.lastTimestamp) / 1000;

        while (dt >= Game.TIME_STEP) {
            this.controls.update();

            for (const system of this.systems) {
                const filteredEntities = this.entities.filter(system.appliesTo);

                system.update(Game.TIME_STEP, filteredEntities, this);
            }

            dt -= Game.TIME_STEP;
            updates++;

            if (updates >= Game.MAX_UPDATES_PER_FRAME) {
                console.error('Update loop can\'t keep up!');
                this.lastTimestamp = 0;
                break;
            }
        }

        this.lastTimestamp = currentTimestamp;

        requestAnimationFrame(this.update.bind(this));
    }

    private onResize(): void {
        const { innerHeight, innerWidth } = window;

        this.renderer.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
    }
}
