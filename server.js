const express = require("express");
const mongoose = require("mongoose");
const app = express();

const MONGO_URI =
	"mongodb+srv://darreniyer:2EVve6qSi6ObBTQ0@expense-tracker.lsbwr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expense");

// Initialise middleware
app.use(express.json({ extended: false }));

app.use("/api/auth", authRoutes);
app.use("/api/expense", expenseRoutes);

mongoose.connect(MONGO_URI, {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true,
}).then(() => {
    console.log('MongoDB connected...');
    app.listen(5000, () => {
        console.log('Server started on port 5000.');
    })
}).catch(err => {
    console.error(err.message);
});
