import GrassTile from '../Entities/GrassTile';
import WaterTile from '../Entities/WaterTile';

export function generateWorld(width, height) {
    const result = [];

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (Math.random() >= .5) {
                result.push(new WaterTile(x, 0, y));
            } else {
                result.push(new GrassTile(x, 0, y));
            }
        }
    }

    return result;
}
