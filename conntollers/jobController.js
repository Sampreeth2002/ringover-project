const db = require("../models");

// create main model

const Job = db.job;

// main work

// 1. Create Product

const addJob = async (req, res) => {
  //   console.log("**********88");
  console.log(req.body);
  let info = {
    task_id: req.body.task_id,
    priority: req.body.priority,
    dependent: req.body.dependent,
  };
  console.log(info);
  const job = await Job.create(info);
  res.status(200).send(Job);
  console.log(Job);
};
