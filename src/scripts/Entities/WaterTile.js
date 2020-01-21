import { BoxGeometry, MeshPhysicalMaterial, Mesh, MeshBasicMaterial } from 'three';
import Tile from './Tile';
import Floaty from '../Components/Floaty';

export default class WaterTile extends Tile {
    constructor(x, y, z) {
        const materials = new MeshBasicMaterial({color: 0x3282b8});
        super(x, y, z, materials);

        this.addComponents(new Floaty(3, 3));
    }
}