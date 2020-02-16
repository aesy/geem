import { Entity } from '../Entities/Entity';
import { Game } from '../Game/Game';
import { System } from './System';

export class FrameRateCounter extends System {
    private static readonly INTERVAL_SECONDS = 0.1;

    private readonly element: HTMLElement;
    private elapsedTime = 0;

    public constructor() {
        super();

        this.element = document.createElement('div');
        this.element.style.position = 'absolute';
        this.element.style.left = '0';
        this.element.style.top = '0';
        this.element.style.color = 'white';
        this.element.style.backgroundColor = 'rgb(0, 0, 0, 0.5)';
        this.element.style.padding = '10px 15px';
        this.element.style.margin = '10px';
        this.element.style.fontSize = '15px';
        this.element.innerText = 'INF FPS';

        document.body.appendChild(this.element);
    }

    public update(dt: number, entities: Entity[], game: Game): void {
        this.elapsedTime += dt;

        if (this.elapsedTime > FrameRateCounter.INTERVAL_SECONDS) {
            this.elapsedTime = 0;
            this.element.innerText = game.fps.toFixed(1) + ' FPS';
        }
    }
}
