import { resumes } from './data';

class ResumeData {
    getResume() {
        return Object.values(resumes)[0];
    }

    getResumes() {
        return resumes;
    }
}

export default ResumeData 