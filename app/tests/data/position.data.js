import { positions } from './data';
import Position from '../../models/position.model.js';
class PositionData {
    getPosition() {
        return Object.values(positions)[0];
    }

    async setPositions(positions) {
        await Position.insertMany(positions);
    }

    getPositions() {
        return positions;
    }
}

export default PositionData