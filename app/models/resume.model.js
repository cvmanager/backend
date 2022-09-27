const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');


const schema = new mongoose.Schema(
    {
        company_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Company',
        },
        project_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Project',
        },
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true,
            enum: ['men', 'women']
        },
        email: {
            type: String,
            required: true
        },
        birth_year: {
            type: Number,
            required: true
        },
        marital_status: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true
        },
        residence_city: {
            type: String,
            required: true
        },
        work_city: {
            type: String,
            required: true
        },
        education: {
            type: String,
            required: true
        },
        major: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            default: null
        },
        min_salary: {
            type: Number,
            default: null
        },
        max_salary: {
            type: Number,
            default: null
        },
        work_experience: {
            type: Number,
            default: null
        },
        military_status: {
            type: String,
            default: null
        },
        status_updated_at: {
            type: Date,
            default: null
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        },
        toJSON: {
            transform: function (doc, ret, opt) {
                delete ret['deletedBy']
                delete ret['deletedAt']
                delete ret['__v']
                return ret
            }
        }
    }
);

schema.plugin(mongoose_delete, { deletedBy: true, deletedAt: true });

schema.pre(/^find/, function () {
    this.where({ deleted: false });
});




const Resume = mongoose.model("resumes", schema);

module.exports = Resume;