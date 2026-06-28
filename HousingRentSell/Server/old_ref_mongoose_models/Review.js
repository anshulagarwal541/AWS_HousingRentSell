const mongoose = require('mongoose');
const User = require('./User.js');
const Team = require('./team.js');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
    },
    rating: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;