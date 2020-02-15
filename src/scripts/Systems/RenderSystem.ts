import {
    Object3D,
    Scene,
    WebGLRenderer,
    VSMShadowMap,
} from 'three';
import { Entity } from '../Entities/Entity';
import { EntityRemoved } from '../Event/EntityRemoved';
import { Game } from '../Game/Game';
import { System } from './System';

export class RenderSystem extends System {
    public readonly renderer: WebGLRenderer;

    private readonly scene: Scene;
    private readonly deleted: Object3D[] = [];

    public constructor() {
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

        this.scene = scene;
        this.renderer = renderer;
    }

    public initialize(game: Game): void {
        game.events.register(EntityRemoved, (event: EntityRemoved) => {
            const entity = event.entity;
            const object = entity.getComponent(Object3D);

            this.deleted.push(object);
        });
    }

    public appliesTo(entity: Entity): boolean {
        return entity.hasComponent(Object3D);
    }

    public update(dt: number, entities: Entity[], game: Game): void {
        const deleted = this.deleted.pop();

        if (deleted) {
            this.scene.remove(deleted);
        }

        for (const entity of entities) {
            const object = entity.getComponent(Object3D);

            this.scene.add(object);
        }

        this.renderer.render(this.scene, game.camera);
    }
}
