const mongoose = require('mongoose');
const House = require('./house.js')
const User = require('./User.js');
const Team = require('./team.js');
const applicationSchema = new mongoose.Schema({
    name: {
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
    date: {
        type: Date,
        required: true
    },
    message: {
        type: String,
        required: false
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "House"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    controller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    status:{
        type:String,
        enum:['pending', 'contacted'],
        default: "pending"
    }
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;