import Entity from '../Entities/Entity';
import System from './System';

export default class FrameRatePrinter extends System {
    private elapsedTime = 0;

    update(dt: number, entities: Entity[]): void {
        this.elapsedTime += dt;

        if (this.elapsedTime > 1) {
            this.elapsedTime -= 1;
            console.log('Framerate: ', 1 / dt);
        }
    }
}
