import { BoxGeometry, MeshLambertMaterial, Mesh, Vector3 } from 'three';
import { Entity } from './Entity';
import { Health } from '../Components/Health';
import { Physical } from '../Components/Physical';
import { Movable } from '../Components/Movable';
import { Collider } from '../Components/Collider';
import { Id } from '../Components/Id';

export class Friend extends Entity {
    public constructor(id: string) {
        super();

        const width = 0.8;
        const height = 1.9;
        const depth = 0.8;

        const geometry = new BoxGeometry(width, height, depth);
        geometry.computeBoundingBox();
        const material = new MeshLambertMaterial({color: 0x00ffff});
        const mesh = new Mesh(geometry, material);

        mesh.position.set(0, 0, 0);

        this.addComponents(mesh, new Physical(15), new Movable(new Vector3()), new Collider(geometry.boundingBox), new Health(10), new Id(id));
    }
}
