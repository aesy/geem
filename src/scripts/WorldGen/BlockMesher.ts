export interface BlockMesher {
    vertices: number[];
    uvs: number[];
    normal: number[];
    indices: number[];
}

export class StandardBlockMesher implements BlockMesher {
    public vertices: number[] = [
        // LEFT
        0, 1, 0,
        0, 0, 0,
        0, 1, 1,
        0, 0, 1,
        // RIGHT
        1, 1, 1,
        1, 0, 1,
        1, 1, 0,
        1, 0, 0,
        // BOTTOM
        1, 0, 1,
        0, 0, 1,
        1, 0, 0,
        0, 0, 0,
        // TOP 
        0, 1, 1,
        1, 1, 1,
        0, 1, 0,
        1, 1, 0,
        // BACK
        1, 0, 0,
        0, 0, 0,
        1, 1, 0,
        0, 1, 0,
        // FRONT
        0, 0, 1,
        1, 0, 1,
        0, 1, 1,
        1, 1, 1
    ];    
    public uvs: number[] = [
        // LEFT
        0, 1,
        0, 0,
        1, 1,
        1, 0,
        // RIGHT
        0, 1,
        0, 0,
        1, 1,
        1, 0,
        // BOTTOM
        1, 0,
        0, 0,
        1, 1,
        0, 1,
        // TOP
        1, 1,
        0, 1,
        1, 0,
        0, 0,
        // BACK
        0, 0,
        1, 0,
        0, 1,
        1, 1,
        // FRONT
        0, 0,
        1, 0,
        0, 1,
        1, 1,
    ];
    public normal: number[] = [
        // LEFT
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        // RIGHT
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        // BOTTOM
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        // TOP
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        // BACK
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        // FRONT
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
    ];
    public indices: number[] = [
        // LEFT
        0, 1, 2,
        2, 1, 3,
        // RIGHT
        4, 5, 6,
        6, 5, 7,
        // BOTTOM
        8, 9, 10,
        10, 9, 11,
        // TOP
        12, 13, 14,
        14, 13, 15,
        // BACK
        16, 17, 18,
        18, 17, 19,
        // FRONT
        20, 21, 22,
        22, 21, 23,
    ];
}

export class WaterBlockMesher implements BlockMesher {
    public vertices: number[] = [
        // LEFT
        0, 0, 0,
        0, 0, 0,
        0, 0, 1,
        0, 0, 1,
        // RIGHT
        1, 0, 1,
        1, 0, 1,
        1, 0, 0,
        1, 0, 0,
        // BOTTOM
        1, 0, 1,
        0, 0, 1,
        1, 0, 0,
        0, 0, 0,
        // TOP 
        0, 0, 1,
        1, 0, 1,
        0, 0, 0,
        1, 0, 0,
        // BACK
        1, 0, 0,
        0, 0, 0,
        1, 0, 0,
        0, 0, 0,
        // FRONT
        0, 0, 1,
        1, 0, 1,
        0, 0, 1,
        1, 0, 1
    ];    
    public uvs: number[] = [
        // LEFT
        0, 1,
        0, 0,
        1, 1,
        1, 0,
        // RIGHT
        0, 1,
        0, 0,
        1, 1,
        1, 0,
        // BOTTOM
        1, 0,
        0, 0,
        1, 1,
        0, 1,
        // TOP
        1, 1,
        0, 1,
        1, 0,
        0, 0,
        // BACK
        0, 0,
        1, 0,
        0, 1,
        1, 1,
        // FRONT
        0, 0,
        1, 0,
        0, 1,
        1, 1,
    ];
    public normal: number[] = [
        // LEFT
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        // RIGHT
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        // BOTTOM
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        // TOP
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        // BACK
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        // FRONT
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
    ];
    public indices: number[] = [
        // LEFT
        0, 1, 2,
        2, 1, 3,
        // RIGHT
        4, 5, 6,
        6, 5, 7,
        // BOTTOM
        8, 9, 10,
        10, 9, 11,
        // TOP
        12, 13, 14,
        14, 13, 15,
        // BACK
        16, 17, 18,
        18, 17, 19,
        // FRONT
        20, 21, 22,
        22, 21, 23,
    ];
}

export class CrossBlockMesher implements BlockMesher {
    public vertices: number[] = [
        // NS
        0.5, 0, 1,
        0.5, 0, 0,
        0.5, 1, 1,
        0.5, 1, 0,
        // WE
        0, 0, 0.5,
        1, 0, 0.5,
        0, 1, 0.5,
        1, 1, 0.5,
        // NWSE
        0, 0, 1,
        1, 0, 0,
        0, 1, 1,
        1, 1, 0,
        // SWNE
        1, 0, 1,
        0, 0, 0,
        1, 1, 1,
        0, 1, 0,
    ];    
    public uvs: number[] = [
        // NS
        0, 0,
        1, 0,
        0, 1,
        1, 1,
        // WE
        0, 0,
        1, 0,
        0, 1,
        1, 1,
        // NWSE
        0, 0,
        1, 0,
        0, 1,
        1, 1,
        // SWNE
        0, 0,
        1, 0,
        0, 1,
        1, 1,
    ];
    public normal: number[] = [
        // NS
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        // WE
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        // NWSE
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        // SWNE
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
    ];
    public indices: number[] = [
        // NS
        0, 1, 2,
        2, 1, 3,
        // WE
        4, 5, 6,
        6, 5, 7,
        // NWSE
        8, 9, 10,
        10, 9, 11,
        // SWNE
        12, 13, 14,
        14, 13, 15,
    ];
}