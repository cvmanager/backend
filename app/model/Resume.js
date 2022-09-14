const mongoose = require('mongoose');

const Schema = Schema = mongoose.Schema;

const resumeSchema = new Schema(
    {
        project_id: { type: Schema.Types.ObjectId, required: true },
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        gender: { type: String, required: true },
        email: { type: String, required: true },
        birth_year: { type: Number, required: true },
        marital_status: { type: String, required: true },
        resume_status: { type: String, required: true },
        mobile: { type: String, required: true },
        residence_city: { type: String, required: true },
        work_city: { type: String, required: true },
        education: { type: String, required: true },
        major: { type: String, required: true },
        phone: { type: String, default: null },
        min_salary: { type: Number, default: null },
        max_salary: { type: Number, default: null },
        work_experience: { type: Number, default: null },
        military_status: { type: String, default: null },
        created_by: { type: Number, default: 1 },
        deleted_at: { type: Date, default: null },
        deleted_by: { type: Number, default: 1 },
        resume_status_updated_at: { type: Date, default: null }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: "updated_at" } }
);


const Resume = mongoose.model("resumes", resumeSchema);

module.exports = Resume;