import { config } from "./config/config.js";
import connectMongoDB from "./db/mongoDbConnection.js";
import { app } from "./app.js";

connectMongoDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("Error : ", error);
            throw error;
        })
        app.listen(config.port, () => {
            console.log(`Server is running at port: ${config.port}`);
            const currentTimeStamp = new Date;
            console.log(`Server initialized at: ${currentTimeStamp}`);
        })
    })
    .catch((error) => {
        console.log("Database connection failed: ", error);
        throw error;
    })
