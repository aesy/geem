export default class Floaty {
    constructor(speed, offset) {
        this.speed = speed;
        this.direction = 1;
        this.maxOffset = offset;
        this.currentOffset = 0;
    }
}
