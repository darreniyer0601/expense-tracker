const { validationResult } = require('express-validator');

const Expense = require('../models/Expense');
const User = require('../models/User');

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id });
        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

exports.addExpense = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { purpose, location, amount, date } = req.body;

    try {
        const newExpense = new Expense({
            purpose: purpose,
            location: location,
            amount: amount,
            date: date,
            user: req.user.id
        });

        const expense = await newExpense.save();

        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

exports.updateExpense = async (req, res) => {
    const { purpose, location, amount, date } = req.body;

    const expenseFields = {};
    if (purpose) expenseFields.purpose = purpose;
    if (location) expenseFields.location = location;
    if (amount) expenseFields.amount = amount;
    if (date) expenseFields.date = date;

    try {
        let expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ msg: 'Expense not found' });
        }

        // Make sure expense belongs to user
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        expense = await Expense.findByIdAndUpdate(req.params.id, {
            $set: expenseFields
        }, {
            new: true
        })

        res.json(expense);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ msg: 'Expense not found' });
        }

        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Expense.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Expense removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}