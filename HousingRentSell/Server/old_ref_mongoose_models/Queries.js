const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    query: {
        type: String,
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['resolved', 'pending'],
        default: 'pending'
    },
    reply:{
        type:String,
        required:false
    }
})

const Query = mongoose.model('Query', querySchema);

module.exports = Query;