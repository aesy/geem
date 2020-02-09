export class Floaty {
    public direction = 1;
    public currentOffset = 0;

    public constructor(
        public speed: number,
        public maxOffset: number
    ) {}
}
