import { BoxGeometry, MeshLambertMaterial, Mesh, Vector3, Matrix4, Box3, WireframeGeometry } from 'three';
import { Entity } from './Entity';
import { CameraFollow } from '../Components/CameraFollow';
import { Health } from '../Components/Health';
import { Physical } from '../Components/Physical';
import { Controlable } from '../Components/Controlable';
import { Movable } from '../Components/Movable';
import { Collider } from '../Components/Collider';

export class Player extends Entity {
    public constructor() {
        super();

        const width = 1;
        const height = 3;
        const depth = 1;

        const geometry = new BoxGeometry(width, height, depth);
        geometry.computeBoundingBox();
        const material = new MeshLambertMaterial({color: 0xff00ff});
        const mesh = new Mesh(geometry, material);

        mesh.position.set(0, 50, 0);

        this.addComponents(mesh, new Physical(35), new Movable(new Vector3()), new Controlable(), new CameraFollow(true), new Collider(geometry.boundingBox), new Health(10));
    }
}
