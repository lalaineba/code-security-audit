import express, { Express } from "express";
import morgan from "morgan";

import employeeRoutes from "./api/v1/routes/employeeRoutes";

// initialize the express application
const app: Express = express();

// Interface for health check response
interface HealthCheckResponse {
    status: string;
    uptime: number;
    timestamp: string;
    version: string;
}

// Use morgan as a middleware for HTTP request logging
// "combined" is a predefined format for morgan
app.use(morgan("combined"));
app.use(express.json());

// Respond to GET request at endpoint "/" with message
app.get("/", (req, res) => {
    res.send("Hello World");
});

/**
 * Basic ealth check endpoint that returns server status information
 * @returns JSON response with server health metrics
 */

app.get("/api/v1/health", (req, res) => {
    const healthData: HealthCheckResponse = {
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    };

    res.json(healthData);
});

// Create a prefix for all employee routes
app.use("/api/v1/employees", employeeRoutes);

export default app;