require('dotenv').config();

const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bcrypt = require('bcrypt')

// Dynamo DB
const { checkConnection } = require('./AWS/DynamoDB/helpers/table_commands_dynamoDB.js');

// Routes
const { UserRoutes } = require("./routes/user_routes.js");
const { TeamRoutes } = require("./routes/team_routes.js");
const { GeneralRoutes } = require("./routes/general_routes.js");

checkConnection().then(() => {
    console.log("***** Connected to DynamoDB successfully..!! *****");
}).catch((err) => {
    console.log("!!!!! Error connecting to DynamoDB:", err);
});

app.use(cors());
app.use(express.json());

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
}

// User  Routes
app.use("", UserRoutes.router);

// Team Routes
app.use("", TeamRoutes.router);

// General Routes
app.use("", GeneralRoutes.router);

app.use((err, req, res, next) => {
    console.log("error")
    res.status(500).send("Error");
    next(err);
})


app.listen(port, (req, res) => {
    console.log(`Sucessfully connected to port : ${port}....`);
})
