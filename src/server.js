const app = require('./app')
require("dotenv").config();
const connectDB=require("./config/db");
const PORT=process.env.PORT;


const start = async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, () => {
            console.log(`Server starts on port ${PORT}`);
        });
    } catch (err) {
        console.log("database connection failed", err.message);
        process.exit(1);
    }
};

start();
