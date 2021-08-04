const mongoose = require('mongoose');

const ExpenseSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    purpose: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        default: new Date().getDate()
    }
})

module.exports = mongoose.model('Expense', ExpenseSchema);