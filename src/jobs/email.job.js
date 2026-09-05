const emailQueue = require("../queues/email.queue");

class EmailJob {

  static async addEmailJob(name, data) {
    await emailQueue.add(name, data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: 100,
      removeOnFail: 50
    });
  }

  static async sendWelcomeMail(data) {
    await this.addEmailJob("welcome-mail", data);
  }

  static async customerCredentialMail(data) {
    await this.addEmailJob("customer-cred-mail", data);
  }
}

module.exports = EmailJob;
