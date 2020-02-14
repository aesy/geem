import { Object3D, Vector3, Box3, BoxGeometry, Mesh } from 'three';
import { Movable } from '../Components/Movable';
import { Entity } from '../Entities/Entity';
import { System } from './System';
import { Game } from '../Game/Game';
import { World } from '../WorldGen/World';
import { BlockUtils } from '../WorldGen/Block';
import { Collider } from '../Components/Collider';

interface Collisions {
    a: Box3;
    b: Box3;
}

export class TerrainCollisionSystem extends System {
    public constructor(private readonly world: World) {
        super();
        
    }

    private intersect(a: Box3, b: Box3): boolean {
        return  (a.min.x <= b.max.x && a.max.x >= b.min.x) &&
                (a.min.y <= b.max.y && a.max.y >= b.min.y) &&
                (a.min.z <= b.max.z && a.max.z >= b.min.z);
    }

    private makeBoundingBox(x: number, y: number, z: number): Box3 {
        const geometry = new BoxGeometry(1, 1, 1);
        geometry.translate(x + 0.5, y + 0.5, z + 0.5);
        geometry.computeBoundingBox();
        const box = geometry.boundingBox;

        return box;
    }

    private getIntersectArea(a: Box3, b: Box3): any {
        const min = {x: Math.max(a.min.x, b.min.x), y: Math.max(a.min.y, b.min.y), z: Math.max(a.min.z, b.min.z)};
        const max = {x: Math.min(a.max.x, b.max.x), y: Math.min(a.max.y, b.max.y), z: Math.min(a.max.z, b.max.z)};

        const object = {
            min: min,
            max: max,
        };

        return object;
    }

    private resolveCollisions(collisions: { a: Box3; b: Box3 }[], object: Object3D, velocity: Vector3): void {

        let x = 0;
        let y = 0;
        let z = 0;
        
        for (const collision of collisions) {
            const aPos = collision.a.getCenter(new Vector3());
            const bPos = collision.b.getCenter(new Vector3());

            const intersectionArea = this.getIntersectArea(collision.a, collision.b);

            const deltaX = intersectionArea.max.x - intersectionArea.min.x;
            const deltaY = intersectionArea.max.y - intersectionArea.min.y;
            const deltaZ = intersectionArea.max.z - intersectionArea.min.z;

            const min = Math.min(deltaY, deltaX, deltaZ);
            
            // OVER AND UNDER
            if (deltaY === min) { 
                if (aPos.y > bPos.y) {
                    velocity.y = Math.max(0, velocity.y);
                    y = deltaY;
                } else {
                    y = -1 * deltaY;
                    velocity.y = Math.min(0, velocity.y);
                }
            }

            // NORTH AND SOUTH
            if (deltaZ === min) {
                if (aPos.z > bPos.z) {
                    z = deltaZ;
                } else {
                    z = -1 * deltaZ;
                }
            }
    
            // WEST AND EAST
            if  (deltaX === min) { 
                if (aPos.x > bPos.x) {
                    x = deltaX;
                } else {
                    x = -1 * deltaX;
                }
            }
        };

        object.position.x += x;
        object.position.y += y;
        object.position.z += z;
    };
        
    public appliesTo(entity: Entity): boolean {
        return entity.hasComponents(Collider, Movable, Object3D);
    };

    public update(dt: number, entities: Entity[], game: Game): void {
        for (const entity of entities) {
            const object = entity.getComponent(Object3D);
            const velocity = entity.getComponent(Movable).velocity;
            const box = new Box3().setFromObject(object);

            // Object box
            const boxXMin = box.min.x;
            const boxYMin = box.min.y;
            const boxZMin = box.min.z;
            const boxXMax = box.max.x;
            const boxYMax = box.max.y;
            const boxZMax = box.max.z;

            // Boundries
            const xMin = Math.floor(boxXMin);
            const xMax = Math.ceil(boxXMax);
            const yMin = Math.floor(boxYMin);
            const yMax = Math.ceil(boxYMax);
            const zMin = Math.floor(boxZMin);
            const zMax = Math.ceil(boxZMax);

            // Dimensions
            const width = xMax - xMin;
            const height = yMax - yMin;
            const depth = zMax - zMin;

            const terrain = [];

            const collisions: Collisions[] = [];

            for (let w = 0; w < width; w++) {
                for (let d = 0; d < depth; d++) {
                    for (let h = 0; h < height; h++) {
                        terrain.push({
                            x: Math.floor(xMin + w),
                            y: Math.floor(yMin + h),
                            z: Math.floor(zMin + d),
                        });
                    }
                }
            }

            for (const block of terrain) {
                if (BlockUtils.isOpaque(this.world.getBlock(block))) {
                    const terrainBox = this.makeBoundingBox(block.x, block.y, block.z);
                    if (this.intersect(box, terrainBox)) {
                        collisions.push({a: box, b: terrainBox});
                    };
                }
            }

            if (collisions.length > 0) {
                this.resolveCollisions(collisions, object, velocity);
            }
        };
    };
};
