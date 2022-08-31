const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    email: String,
    password: String,
},
{timestamps: { createdAt: true }});
const User = mongoose.model('user', UserSchema);

module.exports = User;
