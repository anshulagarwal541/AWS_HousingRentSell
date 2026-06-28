const mongoose = require('mongoose');
const Team = require('./team.js');
const User = require("./User.js");
const Application = require('./Application.js');
const houseSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    rooms: {
        type: Number,
        required: true,
        min: 1
    },
    bath: {
        type: Number,
        required: true,
        min: 1
    },
    area: {
        type: Number,
        required: true,
        min: 1
    },
    category: {
        type: String,
        enum: ["industrial", "residential", "commercial"],
        default: "residential"
    },
    images: [
        {
            type: String
        }
    ],
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: false
    },
    controller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: false
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application"
        }
    ],
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    companySellStatus: {
        required: true,
        type: String,
        enum: ["pending", "sold"],
        default: "pending"
    },
    userSellStatus: {
        required: true,
        type: String,
        enum: ["none", "pending", "waiting", "sold", "rejected"],
        default: "none"
    },
    sellerType: {
        type: String,
        required: true,
        enum: ["user", "company"],
        default: "company"
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    emiPrice: {
        type: Number,
        required: true,
        min: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:false
    }
});

const House = mongoose.model('House', houseSchema);

module.exports = House;