const express = require("express");
const mongoose = require("mongoose");
const config = require('./config');
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transaction");
const userRoutes = require("./routes/user");
mongoose.connect(config.dbConnection)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(`Could not connect to MongoDB: ${err}`));

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/transaction", transactionRoutes);
app.use("/user", userRoutes);


app.get('/', (req, res) => {
    res.send("Hi from the budget app!");
}) 

const port = config.port;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})