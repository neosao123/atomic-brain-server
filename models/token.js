const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const tokenSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    token: { type: String, required: true},
    createdAt: { type: Date, default: Date.now(),expires: 3600},
});

module.exports = mongoose.model('token', tokenSchema);