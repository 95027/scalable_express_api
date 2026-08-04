const env = require("./config/env");
const startServer = require("./app");
const createAdmin = require("./bootstrap/createAdmin");

(async () => {
  const app = await startServer();
  await createAdmin();
  app.listen(env.port, () => console.log(`Server is running on ${env.port}`));
})();
