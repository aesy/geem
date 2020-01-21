
export default class Floaty {
    constructor(speed, offset) {
        this.speed = speed;
        this.maxOffset = offset;
        this.currentOffset = Math.random() * this.maxOffset;
    }
}
