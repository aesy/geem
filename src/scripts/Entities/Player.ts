import { Entity } from './Entity';
import { CameraFollow } from '../Components/CameraFollow';
import { Physical } from '../Components/Physical';
import { Controlable } from '../Components/Controlable';

export class Player extends Entity {
    public constructor() {
        super();

        this.addComponents(new Physical(15), new Controlable(), new CameraFollow(true));
    }
}
