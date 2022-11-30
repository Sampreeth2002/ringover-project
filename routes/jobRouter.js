// Importing controllers for reviews and products
var amqp = require("amqplib/callback_api");
const db = require("../models");
const Job = db.job;

const router = require("express").Router();

router.post("/mail/addJob", async (req, res) => {
  let mailJob = {
    task_id: req.body.task_id,
    priority: req.body.priority,
    dependent: req.body.dependent,
  };

  amqp.connect("amqp://localhost", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      var queue = "MessageQueue";

      channel.assertQueue(queue, {
        durable: false,
      });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(mailJob)));
      res.send(mailJob).status(200);
    });
  });
});

router.post("/sms/addJob", async (req, res) => {
  let mailJob = {
    task_id: req.body.task_id,
    priority: req.body.priority,
    dependent: req.body.dependent,
  };

  amqp.connect("amqp://localhost", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      var queue = "MessageQueue";

      channel.assertQueue(queue, {
        durable: false,
      });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(mailJob)));
      res.send(mailJob).status(200);
    });
  });
});

var mainQueue = [];

const addingInQueue = () => {
  amqp.connect("amqp://localhost", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      var queue = "MessageQueue";

      channel.assertQueue(queue, {
        durable: false,
      });

      channel.consume(
        queue,
        function (msg) {
          mainQueue.push(JSON.parse(msg.content.toString()));
        },
        {
          noAck: true,
        }
      );
    });
  });
};

setInterval(addingInQueue, 1000);

router.get("/schedule", async (req, res) => {
  var noOfJobs = mainQueue.length;
  for (var i = 0; i < noOfJobs; i++) {
    const job = await Job.create(mainQueue[i]);
  }
  mainQueue = [];
  var allJobs = [];
  allJobs = await Job.findAll({});

  var schedule = [];
  allJobs.sort(dynamicSort("priority"));
  // console.log(allJobs.length);
  var totalJobs = allJobs.length;
  for (var i = 0; i < totalJobs; i++) {
    var currentJob = allJobs[i];
    if (currentJob.task_id < 0) continue;
    // Not depending on other job
    if (currentJob.dependent === null) {
      schedule.push(currentJob.task_id);
      // Removing the depending job from the queue
      currentJob.task_id = -1;
    } else {
      // If depending on other job
      var dependingJobId = currentJob.dependent;
      if (!schedule.includes(dependingJobId)) {
        var foundDependentTask = false;
        for (var j = i; j < totalJobs; j++) {
          if (dependingJobId === allJobs[j].task_id) {
            // Removing the depending job from the queue
            allJobs[j].task_id = -1;
            foundDependentTask = true;
            // Adding the depending job in the schedule
            schedule.push(dependingJobId);
          }
        }
        if (!foundDependentTask) {
          res.send({
            message: `Dependent job of job_id ${currentJob.task_id} not recived yet`,
          });
        }
        schedule.push(currentJob.task_id);
      } else {
        // If the depending job already in the schedule
        schedule.push(currentJob.task_id);
      }
      // Removing current Job from the queue
      currentJob.task_id = -1;
    }
  }
  //   console.log(allJobs);
  res.status(200).send(schedule);
});

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

module.exports = router;
