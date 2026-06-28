const mongoose = require('mongoose');
const House = require('./house.js');
const Chat = require('./Chat.js');
const Application = require('./Application.js');
const teamSchema = new mongoose.Schema({
    image: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    pin: {
        type: Number,
        required: true
    },
    memberId: {
        type: String,
        required: true
    },
    assignedHouses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "House"
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    totalRating: {
        type: Number,
        default: 0
    },
    chats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat'
        }
    ],
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application"
        }
    ]
})

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;