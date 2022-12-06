import { Types } from 'mongoose';

import Resume from '../../models/resume.model';
import { userOne } from './user.fixture';

export const resumeOne = {
    _id: Types.ObjectId(),
    company_id: "638f13474e23a04f88077875",
    project_id: "638f13474e23a04f88077876",
    firstname: "sample resume firstname",
    lastname: "sample resume lastname",
    gender: "men",
    email: "sample_resume_email@gmail.com",
    birth_year: 1372,
    marital_status: "single",
    status: "pending",
    mobile: "989121211212",
    residence_city: "sample resume residence city",
    work_city: "sample resume work city",
    education: "phd",
    major: "sample resume residence major",
    phone: "989121211212",
    min_salary: 100000,
    max_salary: 1000000,
    work_experience: 13,
    military_status: "included",
    status_updated_at: null,
    created_by: userOne._id,
};

export const insertResumes = async (resumes) => {
    await Resume.insertMany(resumes);
};


