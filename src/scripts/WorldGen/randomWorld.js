import GrassTile from '../Entities/GrassTile';
import WaterTile from '../Entities/WaterTile';
import { makeNoise2D } from 'open-simplex-noise';

export function generateWorld(width, height, frequency, amplitude, seed ) {
    const result = [];
    let xOff = 0;
    let zOff = 0;
    const noise2D = makeNoise2D(seed);
    for (let z = 0; z < height; z++) {
        zOff = 0;
        for (let x = 0; x < width; x++) {
            let r = noise2D(zOff * frequency, xOff * frequency) * amplitude;
            result.push(new GrassTile(x, Math.round(r), z));
            zOff += 0.1;
        }
        xOff += 0.1;
    }

    for (let z = 0; z < height; z++) {
        for (let x = 0; x < width; x++) {
            result.push(new WaterTile(x, 0, z));
        }
    }

    return result;
}
