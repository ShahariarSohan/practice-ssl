import { envVars } from './app/config/env';
/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { seedSuperAdmin } from './app/utils/seedSuperAdmin';

let server: Server;


const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL );
    console.log("✅ Connected to MongoDB");

    server = app.listen(envVars.PORT, () => {
      console.log(`✅ Server is running on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
(async () => {
  await  startServer();
   await seedSuperAdmin();
})()
process.on("unhandledRejection", (err) => {
  console.log("unhandled rejection detected server shutting down", err);
    if (server) {
        server.close(() => {
          process.exit(1)
      })
    }
    process.exit(1)
});
// Unhandled Rejection Error
// Promise.reject(new Error("Forget to catch error") )

process.on("uncaughtException", (err) => {
    console.log("uncaught exception error server shutting down....", err);
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})
process.on("SIGINT", (err) => {
    console.log("SIGINT signal got, server shutting down....", err);
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received, server shutting down....");
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})
process.on("SIGINT", () => {
    console.log("SIGINT signal received, server shutting down....");
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})


//Uncaught Exception Error
// throw new Error("This is a local error")
