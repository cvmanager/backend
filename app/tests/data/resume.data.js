import { resumes } from './data';

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
}

export default ResumeData