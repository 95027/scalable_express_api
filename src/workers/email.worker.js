const { Worker } = require("bullmq");
const EmailService = require("../services/email/email.service");
const connection = require("../config/redis");

const worker = new Worker(
  "email",
  async (job) => {
    switch (job.name) {
      case "welcome-mail":
        await EmailService.sendWelcomeMail(job.data);
        break;

      default:
        throw new Error(`unkown job: ${job.name}`);
    }
  },
  {
    connection,
  },
);

worker.on("completed", (job) => {
  console.log(`job completed ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`job failed ${job.id}`, err.message);
});

module.exports = worker;
