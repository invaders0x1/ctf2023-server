const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    question1: {
        type: Boolean,
        default: false
    },
    question2: {
        type: Boolean,
        default: false
    },
    question3: {
        type: Boolean,
        default: false
    },
    question4: {
        type: Boolean,
        default: false
    },
    question5: {
        type: Boolean,
        default: false
    },
    question6: {
        type: Boolean,
        default: false
    },
    question7: {
        type: Boolean,
        default: false
    },
    question8: {
        type: Boolean,
        default: false
    },
    question9: {
        type: Boolean,
        default: false
    },
    question10: {
        type: Boolean,
        default: false
    },
    question11: {
        type: Boolean,
        default: false
    },
    question12: {
        type: Boolean,
        default: false
    },
    question13: {
        type: Boolean,
        default: false
    },
    question14: {
        type: Boolean,
        default: false
    },
    question15: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports =  mongoose.model('user', UserSchema);