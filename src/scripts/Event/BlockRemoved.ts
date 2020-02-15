import { Coordinate3 } from '../Util/Math';

export class BlockRemoved {
    public constructor(
        public readonly position: Coordinate3
    ) {}
}
