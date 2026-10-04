require("dotenv").config();

const app = require("./src/app.js");

const connectDB = require("./src/config/db.js");

const redis = require("./src/config/redis.js");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log("...........................APIs.............");
        console.log(`E-Commerce API running on http://localhost:${PORT}`);
        console.log(`Swagger docs running on http://localhost:${PORT}/api-docs`);
        console.log(`Redis health check running on http://localhost:${PORT}/api/health/redis`);
        console.log(".........................../APIs.............");
    });
}

startServer();