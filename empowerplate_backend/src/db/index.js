import mongoose from "mongoose";
import { config } from "../config/config.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${config.mongoDbUrl}/${config.dbName}`);
        console.log(`\nMongoDB connected !! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Error: DB Connection - ", error);
        process.exit(1);
    }
}

export default connectDB;