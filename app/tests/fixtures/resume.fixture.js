import { Types } from 'mongoose';

import Resume from '../../models/resume.model';
import { userOne } from './user.fixture';
import { companyOne } from './company.fixture';
import { projectOne } from './project.fixture';
import { positionOne } from './position.fixture';

export const resumeOne = {
    _id: Types.ObjectId(),
    company_id: companyOne._id,
    project_id: projectOne._id,
    position_id: positionOne._id,
    firstname: "sample resume firstname",
    lastname: "sample resume lastname",
    gender: "men",
    email: "sample_resume_email@gmail.com",
    birth_year: 1372,
    marital_status: "single",
    status: "pending",
    mobile: "989121211212",
    residence_city: Types.ObjectId(),
    work_city: Types.ObjectId(),
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


