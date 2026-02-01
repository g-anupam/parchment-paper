import dotenv from "dotenv";
import { app } from "./src/app.js";
import connectDB from "./src/db/database.js";

// Load env variables at the absolute top
dotenv.config({
    path: "./.env"
});

const PORT = process.env.PORT || 8000;

/**
 * START SERVER
 * Connects to MongoDB first, then starts the Express app.
 */
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`🚀 KEEP REPLICA SERVER IS LIVE`);
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`📡 Port: ${PORT}`);
            console.log(`🌍 Mode: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 Health: http://localhost:${PORT}/health`);
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
        });
    })
    .catch((err) => {
        console.error("❌ MONGO DB connection failed! ", err);
        process.exit(1);
    });

// --- GRACEFUL SHUTDOWN & ERROR TRACKING (From your past project) ---

process.on('unhandledRejection', (error) => {
    console.error('❌ UNHANDLED REJECTION! Shutting down server...');
    console.error(error);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('❌ UNCAUGHT EXCEPTION! Shutting down server...');
    console.error(error);
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log('\n⚠️  SIGINT received. Closing server gracefully...');
    process.exit(0);
});