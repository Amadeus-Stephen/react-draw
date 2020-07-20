const express = require("express");
const Canvas = require("../models/Canvas.js");
const router = express.Router();

router.get("/", function (req, res) {
  Canvas.find()
    .then((canvas) => res.json(canvas))
    .catch((err) => res.status(400).json("Error: " + err));
});
router.post("/create", function (req, res) {
  const canvas = req.body.canvas;
  Canvas.create({ canvas: canvas})
    .then(() => res.json("canvas added:"))
    .catch((err) => res.status(400).json("Error: " + err));
});
router.route("/update/:id").post((req, res) => {
  Canvas.findById(req.params.id)
    .then((canvas) => {
      canvas.canvas = req.body.canvas;
 
      canvas
        .save()
        .then(() => res.json("canvas updated"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});
router.get("/:id", function(req, res) {
  Canvas.findById(req.params.id)
  .then((canvas) => res.json(canvas))
  .catch((err) => res.status(400).json(`error ${err}`))
})
module.exports = router;