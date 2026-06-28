const mongoose = require('mongoose');
const Review = require('./Review.js');
const Query = require('./Queries.js');
const Application = require('./Application.js');
const House = require('./house.js');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    queries: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Query"
        }
    ],
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application"
        }
    ],
    ownedHouses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'House'
        }
    ]
})

const User = mongoose.model('User', userSchema);

module.exports = User;