const mongoose = require('mongoose');
const Resume = require('./resume.model')
const Project = require('./project.model')
const mongoose_delete = require('mongoose-delete');


const schema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            default: null,
        },
        lastname: {
            type: String,
            default: null,
        },
        mobile: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        mobile_verified_at: {
            type: String,
            default: null,
        },
        avatar: {
            type: String,
            default: null,
        },
        is_banded: {
            type: Boolean,
            default: null,
        },

    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        },
        toJSON: {
            virtuals: true,
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




schema.virtual('projects', {
    ref: Project,
    localField: '_id',
    foreignField: 'created_by'
});

schema.virtual('resumes', {
    ref: Resume,
    localField: '_id',
    foreignField: 'created_by'
});

const User = mongoose.model("users", schema);
module.exports = User;