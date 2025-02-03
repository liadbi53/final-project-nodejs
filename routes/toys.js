const express = require("express");
const { ToyModel, validateToy } = require("../models/toyModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let limit = 10;
    let skip = Number(req.query.skip) || 0;
    let data = await ToyModel.find({}).limit(limit).skip(skip);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.get("/single/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let data = await ToyModel.findById(id);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.post("/", auth, async (req, res) => {
  let validBody = validateToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let toy = new ToyModel({ ...req.body, user_id: req.tokenData._id });
    await toy.save();
    res.json(toy);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.put("/:id", auth, async (req, res) => {
  let validBody = validateToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let id = req.params.id;
    let toy = await ToyModel.findById(id);
    if (!toy || toy.user_id !== req.tokenData._id) {
      return res.status(403).json({ err: "You are not authorized to edit this toy" });
    }
    let data = await ToyModel.updateOne({ _id: id }, req.body);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    let id = req.params.id;
    let toy = await ToyModel.findById(id);
    if (!toy || toy.user_id !== req.tokenData._id) {
      return res.status(403).json({ err: "You are not authorized to delete this toy" });
    }
    let data = await ToyModel.deleteOne({ _id: id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

module.exports = router;
