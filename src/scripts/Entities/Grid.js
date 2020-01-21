import { PlaneGeometry, EdgesGeometry, LineSegments,  Group, Object3D, Line, LineBasicMaterial } from 'three';
import Entity from './Entity';

export default class Grid extends Entity {
    constructor() {
        super();

        const tileZ = 10;
        const tileX = 10;
        const gridZ = 20;
        const gridX = 20;

        const geometry = new PlaneGeometry(tileX, tileZ, 0, 0);
        const wireframe = new EdgesGeometry(geometry);
        const material = new LineBasicMaterial({color: 0xffffff, linewidth: 1});
        wireframe.rotateX(Math.PI / 2);

        const group = new Group();
        
            for (let z = 0; z < gridX; z++) {
                for (let x = 0; x < gridZ; x++) {
                    const line = new LineSegments(wireframe, material);
                    line.position.x = x * tileX;
                    line.position.z = z * -tileZ;
                    line.position.y = 5;
                    line.material.depthTest = false;
                    line.material.opacity = 0.25;
                    line.material.transparent = true;
                    group.add(line);                
                }
            }

        this.addComponents(group);     
    }

}