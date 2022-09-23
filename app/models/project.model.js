const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: null
        },
        is_active: {
            type: Boolean,
            default: 1
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
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



const Project = mongoose.model('projects', schema);

module.exports = Project;
