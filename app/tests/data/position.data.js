import { positions } from './data';
import Position from '../../models/position.model.js';
import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
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

    addPosition(position) {
        Position.insertMany(position);
    }

    async setDeActiveData() {
        let position = {
            "_id": Types.ObjectId(),
            "company_id": Types.ObjectId(),
            "project_id": Types.ObjectId(),
            "title": faker.random.alpha(15),
            "level": "mid",
            "description": faker.random.alpha(50),
            "created_by": Types.ObjectId(),
            "is_active": false,
        }

        await this.setPositions([position]);
        return position
    }
}

export default PositionData