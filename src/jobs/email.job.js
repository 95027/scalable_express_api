const emailQueue = require("../queues/email.queue");

class EmailJob {
  static async sendWelcomeMail(data) {
    await emailQueue.add("welcome-mail", data, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: 100,
      removeOnFail: 50,
    });
  }
}

module.exports = EmailJob;
