const express = require("express");
const cors = require("cors");
const app = express();
var bodyParser = require("body-parser");
var corOptions = {
  origin: " https://localhost:8081",
};

// Reddis connection

// const redis = require("redis");
// const redisClient = redis.createClient(6379, "127.0.0.1");
// redisClient.connect();
// redisClient.on("connect", function (err) {
//   if (err) console.log(err);
//   else console.log("Connected to Redis");
// });

// Middleware

app.use(cors(corOptions));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// routers

const router = require("./routes/jobRouter");
app.use("/", router);

// app.get("/home", async (req, res) => {
//   let keyName = "normalKey";
//   let getCacheData = await redisClient.get(keyName);
//   let result = {
//     id: 12,
//     name: "Test Demo",
//   };
//   let responseArray = "";
//   if (getCacheData) {
//     console.log("GET Cache");
//     responseArray = JSON.parse(getCacheData);
//     console.log(getCacheData);
//   } else {
//     console.log("SET CACHE");
//     redisClient.set(keyName, JSON.stringify(result));
//   }
//   res.status(200).json(responseArray);
// });

app.listen(3000, () => {
  console.log("App is listening to the port 3000");
});
