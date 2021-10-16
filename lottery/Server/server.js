import express from "express";

import path from "path";
const __dirname = path.resolve();

import http from 'http';
import https from 'https';

import compression from 'compression';

import fs from 'fs';

import cors from 'cors';
import userRoute from './routes/User.js';
import dotenv from "dotenv";

// import { mailRoute } from './routes/routes.js'




dotenv.config();

// Start Express Instance
const app = express();





app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use("/usr", userRoute);

// Setting port
const devPort = process.env.PORT || 5000;
const httpPort = process.env.PORT || 80;
const httpsPort = process.env.PORT || 443
const host = process.env.HOST || "0.0.0.0"
const environment = "production"




// Compression
app.use(compression())

// Body parsing middleware; Set max file size to 10mb
app.use(express.json({ limit: '1mb' }));
// app.use(express.urlencoded({ limit: '10mb' }));


// Routing config
// mailRoute(app)



// Serve static assets if in production
if (process.env.NODE_ENV === 'production' && environment === "production") {
    // Set static folder
    app.use(express.static("client/build"))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
} else {
    console.log("SERVER SET TO DEVELOPMENT. MAKE SURE LINUX ENVIRONMENT IS SET TO PRODUCTION:")
    console.log("export NODE_ENV=production")
    console.log("==================")
    console.log("==================")
    console.log("==================")
    console.log("Make sure you run build script for react client")
}

// Start Node server and listen on port
// httpsServer.listen(httpsPort, host, () => console.log(`Node Server started on port: ${host}:${httpsPort}`));
// httpServer.listen(httpPort, host, () => console.log(`Node Server started on port: ${host}:${httpPort}`));
app.listen(devPort, () => console.log(`NODE SERVER STARTED ON PORT ${devPort}`))