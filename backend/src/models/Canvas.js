const mongoose = require('mongoose')

const canvasSchema = new mongoose.Schema({
    canvas: {
        type: String,
        required: true,
    },
  
})

module.exports = mongoose.model("Canvas", canvasSchema)