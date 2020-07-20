const express = require("express");
const mongoose = require("mongoose");

const canvases = require("./routes/Canvas");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
require("dotenv").config();

const app = express();
const server = require("http").Server(app)
app.use(cors());
app.use(express.json());

app.use("/canvases", canvases);

server.listen(PORT ,() => console.log(`Listen on *: ${PORT}`))
async function run() {
  try {
    await mongoose.connect("mongodb://localhost:27017/drawData", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology:true
    });

    console.log("Connected correctly to server");
  } catch (err) {
    console.log(err.stack);
  }
}

run().catch(console.dir);

