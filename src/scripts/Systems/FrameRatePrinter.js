import System from './System';

export default class FrameRatePrinter extends System {
    constructor() {
        super();

        this.elapsedTime = 0;
    }

    update(dt, entities) {
        this.elapsedTime += dt;

        if (this.elapsedTime > 1) {
            this.elapsedTime -= 1;
            console.log('Framerate: ', 1 / dt);
        }
    }
}
