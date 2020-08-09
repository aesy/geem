import { BoxGeometry, MeshLambertMaterial, Mesh, Vector3 } from 'three';
import { Entity } from './Entity';
import { HasCamera } from '../Components/HasCamera';
import { Health } from '../Components/Health';
import { Physical } from '../Components/Physical';
import { Controlable } from '../Components/Controlable';
import { Movable } from '../Components/Movable';
import { Collider } from '../Components/Collider';

export class Player extends Entity {
    public constructor() {
        super();

        const width = 0.8;
        const height = 1.9;
        const depth = 0.8;

        const geometry = new BoxGeometry(width, height, depth);
        geometry.computeBoundingBox();
        const material = new MeshLambertMaterial({color: 0xff00ff});
        const mesh = new Mesh(geometry, material);

        mesh.position.set(10, 50, 10);

        this.addComponents(mesh, new Physical(20), new Movable(new Vector3()), new Controlable(), new HasCamera(), new Collider(geometry.boundingBox), new Health(10));
    }
}
