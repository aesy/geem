import Entity from './Entity';
import { Mesh, BoxGeometry } from 'three';

const TILE_SIZE = 10;

export default class Tile extends Entity {
    constructor(x, y, z, materials) {
        super();
        const geometry = new BoxGeometry(TILE_SIZE, TILE_SIZE, TILE_SIZE);
        const mesh = new Mesh(geometry, materials);

        mesh.position.x = x * TILE_SIZE;
        mesh.position.y = y * TILE_SIZE;
        mesh.position.z = z * -TILE_SIZE;

        this.addComponents(mesh);
    }
}