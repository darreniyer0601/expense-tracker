const express = require("express");
const router = express.Router();

const { check } = require("express-validator");

const isAuth = require('../middleware/isAuth');
const expenseController = require("../controllers/expense");

// @route   GET /api/expense
// @desc    Fetch user's expenses
// @access  Private
router.get("/", isAuth, expenseController.getExpenses);

// @route   POST /api/expense
// @desc    Add a new expense
// @access  Private
router.post(
	"/",
	[
		check("purpose", "Purpose is required").not().isEmpty(),
		check("location", "Location is required").not().isEmpty(),
		check("amount", "Amount is required and should be a number")
			.not()
			.isEmpty()
			.isNumeric(),
		check("date", "Date is required").not().isEmpty(),
		isAuth
	],
	expenseController.addExpense
);

// @route   PUT /api/expense
// @desc    Update an expense
// @access  Private
router.put(
	"/:id",
	[
		check("purpose", "Purpose is required").not().isEmpty(),
		check("location", "Location is required").not().isEmpty(),
		check("amount", "Amount is required and should be a number")
			.not()
			.isEmpty()
			.isNumeric(),
		check("date", "Date is required").not().isEmpty(),
		isAuth
	],
	expenseController.updateExpense
);

// @route   DELETE /api/expense
// @desc    Delete an expense
// @access  Private
router.delete("/:id", isAuth, expenseController.deleteExpense);

module.exports = router;