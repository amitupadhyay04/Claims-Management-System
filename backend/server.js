require("dotenv").config({ path: "./config/.env" });

const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const mongoose = require("mongoose");
const cors = require("cors");

const claimRoutes = require("./routes/claims");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth");
const policyRoutes = require("./routes/policies");
const uploadRoutes = require("./routes/upload");
const emailRoutes = require("./routes/emailRoutes")

const app = express();
app.use(express.json());
app.use(cors());
const promBundle = require('express-prom-bundle');

const metricsMiddleware = promBundle({ includeMethod: true });
console.log("✅ Prometheus metrics middleware loaded!"); // <-- Add this
app.use(metricsMiddleware);

app.use("/api/auth", authRoutes);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Claims Management API",
      version: "1.0.0",
      description: "API for managing insurance claims",
    },
    servers: [
      {
        url: process.env.API_GATEWAY_URL , // Replace with your API Gateway URL
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [], // Apply JWT security globally
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your route files
};

app.get('/health', (req, res) => {
  res.status(200).json({ status: "OK" });
});

const swaggerSpec = swaggerJsDoc(swaggerOptions);


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

//Policy Routes
app.use("/api/policies", policyRoutes);

// API Routes
app.use("/api/claims", claimRoutes);

//Doc Upload 
app.use("/api/doc", uploadRoutes);

//Email-Service
app.use("/api/mail", emailRoutes);


app.get("/", (req, res) => {
  res.send("Claims Management API is running...");
});

app.use(errorHandler);
// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
