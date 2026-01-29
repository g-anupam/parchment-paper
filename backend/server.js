import dotenv from "dotenv"
import connectDatabase from "./src/db/database.js"

dotenv.config({
    path:'./.env'
})

connectDatabase()