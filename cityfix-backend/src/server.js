const app = require("./app");
const { env } = require("./config/env");
const { connectMongo } = require("./config/mongo");

(async () => {
    await connectMongo();

    app.listen(env.PORT, () => {
        console.log(`CityFix server is running on port -> localhost:${env.PORT}`);
    });
})();