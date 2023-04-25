import { interviews } from './data';
import Interview from '../../models/interview.model.js';

class InterviewData {
    getInterview() {
        return Object.values(interviews)[0];
    }

    getInterviews() {
        return interviews;
    }

    addInterview(interviews) {
        Interview.insertMany(interviews);
    }
}

export default InterviewData 