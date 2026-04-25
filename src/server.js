const env = require("./config/env");
const startServer = require("./app");

(async () => {
  const app = await startServer();
  app.listen(env.port, () => console.log(`Server is running on ${env.port}`));
})();
