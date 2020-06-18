import { vec3 } from 'gl-matrix';

export namespace Direction {
    export const UP: vec3 = [ 0, 1, 0 ];
    export const DOWN: vec3 = [ 0, -1, 0 ];
    export const WEST: vec3 = [ -1, 0, 0 ];
    export const EAST: vec3 = [ 1, 0, 0 ];
    export const NORTH: vec3 = [ 0, 0, 1 ];
    export const SOUTH: vec3 = [ 0, 0, -1 ];
}
