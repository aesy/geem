import { BoxGeometry, MeshPhysicalMaterial, Mesh, MeshBasicMaterial } from 'three';
import Tile from './Tile';

export default class GrassTile extends Tile {
    constructor(x, y, z) {
        const topMaterial = new MeshBasicMaterial({color: 0x8cba51});
        const otherMaterial = new MeshBasicMaterial({color: 0xe08f62});
        const materials = [
            otherMaterial,
            otherMaterial,
            topMaterial,
            otherMaterial,
            otherMaterial,
            otherMaterial
        ];
        super(x, y, z, materials);
    }
}