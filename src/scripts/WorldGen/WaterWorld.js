import WaterTile from '../Entities/WaterTile';

export function generateWorld(width, height) {
    const result = [];

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            result.push(new WaterTile(x, 0, y));
        }
    }

    return result;
}
