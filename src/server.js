const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT;
const start = async () => {

    try {
        await connectDB();

    } catch (err) {
        console.error("database connection failded", err.message);
    };

    const server = app.listen(PORT, () => {
        console.log(`server listen on port ${PORT}`)
    })
};

start();