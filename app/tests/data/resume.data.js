import { resumes } from './data';
import Resume from '../../models/resume.model.js';

class ResumeData {
    getResume() {
        return Object.values(resumes)[0];
    }

    getResumes() {
        return resumes;
    }

    addResume(resumes) {
        Resume.insertMany(resumes);
    }
}

export default ResumeData 