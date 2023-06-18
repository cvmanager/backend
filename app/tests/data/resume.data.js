import { resumes } from './data';
import Resume from '../../models/resume.model.js';

class ResumeData {
    getResume() {
        return Object.values(resumes)[0];
    }

    getResumes() {
        return resumes;
    }

    getResumeByEntity(entity) {
        return resumes.find(resume => resume.entity == entity);
    }

    getResumeByEntityId(entityId) {
        return resumes.find(resume => resume.entity_id == entityId);
    }
    
    addResume(resumes) {
        Resume.insertMany(resumes);
    }
}

export default ResumeData 
