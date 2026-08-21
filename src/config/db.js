const dns=require("dns");
dns.setServers(["8.8.8.8","8.8.4.4"]);

const mongoose =require("mongoose");
require("dotenv").config();

const connnectDB= async()=>{
    await mongoose.connect(process.env.MONGO_URL);
    console.log("database connection established");

}

module.exports=connnectDB;