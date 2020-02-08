export default class Floaty {
    public direction = 1;
    public currentOffset = 0;

    constructor(
        public speed: number,
        public maxOffset: number
    ) {}
}
