const express = require("express");
const cors = require("cors");
const app = express();
var bodyParser = require("body-parser");
var corOptions = {
  origin: " https://localhost:8081",
};

// Middleware

app.use(cors(corOptions));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// routers

const router = require("./routes/jobRouter");
app.use("/", router);

// Testing API

app.get("/", (req, res) => {
  res.send("Hi there!");
});

// const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log("App is listening to the port 3000");
});
