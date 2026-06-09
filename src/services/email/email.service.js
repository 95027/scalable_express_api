const { welcomeTemplate } = require("./email.template");
const transporter = require("./email.transport");

class EmailService {
  static async sendEmail({ to, subject, text, html }) {
    return transporter.sendMail({
      from: `"My App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
  }

  static async sendWelcomeMail({ to, name }) {
    return this.sendEmail({
      to,
      subject: "Welcome to MyApp 🎉",
      text: `Hello ${name}, welcome to our platform!`,
      html: welcomeTemplate(name),
    });
  }
}

module.exports = EmailService;
