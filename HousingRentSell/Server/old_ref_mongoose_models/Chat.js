const mongoose = require('mongoose');
const Team = require('./team.js');
const chatSchema = new mongoose.Schema({
    message: [
        {
            type: String,
            required: true
        }
    ],
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;