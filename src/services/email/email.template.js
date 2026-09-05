exports.welcomeTemplate = (name) => {
  return `
  Hello ${name},
  Welcome to our platform 🎉
`;
};

exports.customerCredentialsTemplate = (data) => {
  return ` <p>Hello ${data.name},</p>
    < p > Welcome to our platform 🎉</ >

    <p>Your customer account has been created successfully.</p>

    <p><strong>Customer Code:</strong> ${data.customerCode}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Temporary Password:</strong> ${data.password}</p>

    <p>You can use these credentials to log in to your account.</p>

    <p>Please change your password after your first login.</p>

<p>Regards,<br />
Logistics Team</p>

`;
};
