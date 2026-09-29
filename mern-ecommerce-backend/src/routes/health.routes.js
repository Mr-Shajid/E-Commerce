const express = require("express");
const mongoose = require("mongoose");
const { successResponse } = require("../utils/apiResponse");

const router = express.Router();

router.get("/api/health", (req, res) => {
    const dbState = mongoose.connection.readyState;
    successResponse(res, 200, "API health check successful", {
        service : "mern ecommerce databse",
        database: dbState === 1 ? "connected" : "disconnected",
        timestamp: new Date().toISOString(),
    });
})

module.exports = router;