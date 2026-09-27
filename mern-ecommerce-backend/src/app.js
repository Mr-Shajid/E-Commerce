const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");


const routes = require("./routes");
const openApiDocument = require("./docs/openapi");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");


const app = express();


app.use(helmet());
app.use(cors({origin: process.env.CORS_ORIGIN || "*"}));
app.use(morgan("dev"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use(express.json({limit: "1mb"}));
app.get("openapi.json", (req, res) => {
    res.json(openApiDocument);
});

app.use(routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;