const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    deleted_at: {
        type: Date,
        default: null
    },
    deleted_by: {
        type: Number,
        default: null
    },

},
    { timestamps: { createdAt: 'created_at', updatedAt: "updated_at" } }
);

const User = mongoose.model("users", userSchema);
module.exports = User;