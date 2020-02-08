// import { BufferAttribute, BufferGeometry } from 'three';
// import World from './World';
//
// export default class GreedyChunkMesher {
//     createGeometry(chunk) {
//         const xOffset = chunk.x * chunk.width;
//         const yOffset = chunk.y * chunk.height;
//         const zOffset = chunk.z * chunk.depth;
//         // TODO use chunk.width/height/depth instead of World.CHUNK_SIZE
//         const vertices = [];
//         const normals = [];
//         const uvs = [];
//         const indices = [];
//
//         for (let backFace = true, b = false; b !== backFace; backFace = backFace && b, b = !b) {
//             for (let norm = 0; norm < 3; norm++) {
//                 const tan = (norm + 1) % 3;
//                 const biTan = (norm + 2) % 3;
//
//                 // TODO use direction instead ?
//                 const normalVector = [ 0, 0, 0 ];
//                 normalVector[ norm ] = 1;
//
//                 // TODO inline
//                 const mask = new Mask2D(World.CHUNK_SIZE, World.CHUNK_SIZE);
//
//                 for (let slice = 0; slice < World.CHUNK_SIZE; slice++) {
//                     const cursor = [ 0, 0, 0 ];
//                     cursor[ norm ] = slice;
//
//                     for (cursor[ biTan ] = 0; cursor[ biTan ] < World.CHUNK_SIZE; ++cursor[ biTan ]) {
//                         for (cursor[ tan ] = 0; cursor[ tan ] < World.CHUNK_SIZE; ++cursor[ tan ]) {
//                             const voxelInSlice = chunk.getBlock(...cursor);
//                             const voxelInPreviousSlice = chunk.getBlock(
//                                 cursor[ 0 ] - normalVector[ 0 ],
//                                 cursor[ 1 ] - normalVector[ 1 ],
//                                 cursor[ 2 ] - normalVector[ 2 ]
//                             );
//
//                             // TODO use block type in mask rather than boolean
//                             mask.set(
//                                 cursor[ tan ],
//                                 cursor[ biTan ],
//                                 voxelInSlice.type !== voxelInPreviousSlice.type
//                             );
//                         }
//                     }
//
//                     let n = 0;
//
//                     for (let y = 0; y < World.CHUNK_SIZE; y++) {
//                         for (let x = 0; x < World.CHUNK_SIZE;) {
//                             if (!mask.get(x, y)) {
//                                 n++;
//                                 x++;
//                                 continue;
//                             }
//
//                             let width = 1;
//                             while (x + width < World.CHUNK_SIZE && mask.get(x + width, y)) {
//                                 width++;
//                             }
//
//                             let height = 1;
//                             outer: for (; y + height < World.CHUNK_SIZE; height++) {
//                                 for (let k = x; k < x + width; k++) {
//                                     if (!mask.get(k, y + height)) {
//                                         break outer;
//                                     }
//                                 }
//                             }
//
//                             const b = [ 0, 0, 0 ];
//                             b[ norm ] = slice;
//                             b[ tan ] = x;
//                             b[ biTan ] = y;
//
//                             const du = [ 0, 0, 0 ];
//                             du[ tan ] = width;
//
//                             const dv = [ 0, 0, 0 ];
//                             dv[ biTan ] = height;
//
//                             const bottomLeft = [
//                                 xOffset + b[ 0 ],
//                                 yOffset + b[ 1 ],
//                                 zOffset + b[ 2 ]
//                             ];
//
//                             const topLeft = [
//                                 xOffset + b[ 0 ] + du[ 0 ],
//                                 yOffset + b[ 1 ] + du[ 1 ],
//                                 zOffset + b[ 2 ] + du[ 2 ]
//                             ];
//
//                             const topRight = [
//                                 xOffset + b[ 0 ] + du[ 0 ] + dv[ 0 ],
//                                 yOffset + b[ 1 ] + du[ 1 ] + dv[ 1 ],
//                                 zOffset + b[ 2 ] + du[ 2 ] + dv[ 2 ]
//                             ];
//
//                             const bottomRight = [
//                                 xOffset + b[ 0 ] + dv[ 0 ],
//                                 yOffset + b[ 1 ] + dv[ 1 ],
//                                 zOffset + b[ 2 ] + dv[ 2 ]
//                             ];
//
//                             // TODO
//                             // const textureIndex = getTextureIndex({ type: 1 }, Direction.UP);
//                             const index = vertices.length / 3;
//
//                             vertices.push(...bottomLeft, ...bottomRight, ...topLeft, ...topRight);
//
//                             // TODO verify count
//                             normals.push(...normalVector, ...normalVector, ...normalVector, ...normalVector);
//
//                             // TODO
//                             // uvs.push([
//                             //     (textureIndex + cursor[ tan ]) * tileWidth / textureWidth,
//                             //     1 - (1 - cursor[ biTan ]) * tileWidth / textureWidth
//                             // ]);
//
//                             if (backFace) {
//                                 indices.push(
//                                     index + 2, index, index + 1,
//                                     index + 1, index + 3, index + 2);
//                             } else {
//                                 indices.push(
//                                     index + 2, index + 3, index + 1,
//                                     index + 1, index, index + 2);
//                             }
//
//                             for (let l = 0; l < height; l++) {
//                                 for (let k = 0; k < width; k++) {
//                                     mask.data[ n + k + l * World.CHUNK_SIZE ] = false;
//                                 }
//                             }
//
//                             x += width;
//                             n += width;
//                         }
//                     }
//                 }
//             }
//         }
//
//         const geometry = new BufferGeometry();
//         geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
//         geometry.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
//         geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
//         geometry.setIndex(indices);
//
//         return geometry;
//     }
// }
//
// class Mask2D {
//     constructor(width, height) {
//         this.width = width;
//         this.height = height;
//         this.data = new Array(width * height);
//     }
//
//     get(x, y) {
//         return this.data[ y * this.width + x ];
//     }
//
//     set(x, y, value) {
//         this.data[ y * this.width + x ] = value;
//     }
//
//     clear() {
//         for (let i = 0; i < this.data.length; i++) {
//             this.data[ i ] = false;
//         }
//     }
// }
