const express = require("express");
const quickDraw = require("quickdraw.js");
const categories = require("quickdraw.js/src/categories");
const axios = require("axios").default;
const cors = require("cors");

const app = express();

app.use(cors());
app.disable("x-powered-by");
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`[x] API Live - ${Date.now()}`);
});

app.post("/intent", async (req, res) => {
  try {
    const { intents: rawIntents } = req.body;
    if (!rawIntents || rawIntents.length <= 0) {
      throw new Error("No intents found. Kindly try again");
    }
    const intents = rawIntents.filter((v) => categories.includes(v));
    for (const intent of intents) {
      const isPresent = quickDraw.checkSet(intent);
      if (!isPresent || isPresent.size < 1) {
        await quickDraw.import(intent, 1, 64);
      }
    }
    const set = quickDraw.set(intents.length, intents);
    console.log(set);
    res.json(set);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});
app.listen(8080, () => {
  console.log("API started on port 8080");
});
