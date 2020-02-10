import { BoxBufferGeometry, MeshLambertMaterial, Mesh } from 'three';
import { Entity } from './Entity';
import { CameraFollow } from '../Components/CameraFollow';
import { Health } from '../Components/Health';
import { Physical } from '../Components/Physical';
import { Controlable } from '../Components/Controlable';

export class Player extends Entity {
    public constructor() {
        super();

        const geometry = new BoxBufferGeometry(1, 1, 1);
        const material = new MeshLambertMaterial({color: 0xff00ff});
        const mesh = new Mesh(geometry, material);

        mesh.position.set(0, 50, 0);

        this.addComponents(mesh, new Physical(5), new Controlable(), new CameraFollow(true), new Health(10));
    }
}
