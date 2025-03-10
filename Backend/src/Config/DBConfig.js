const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()

url = process.env.Mongo_Uri


mongoose
  .connect(url)
  .then(() => {
    console.log("connnection successful");
  })
  .catch((e) => console.error("Database Error", e));