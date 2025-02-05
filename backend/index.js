const express = require("express");
const mongoose = require("mongoose");
const config = require('./config');
// const cors = require("cors");

const app = express();

app.use(express.json());
// app.use(cors());

app.get('/', (req, res) => {
    res.send("Hi from the budget app!");
}) 

const port = config.port;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})