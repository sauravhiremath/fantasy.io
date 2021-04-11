const express = require("express");
const quickDraw = require("quickdraw.js");
const categories = require("quickdraw.js/src/categories");
const axios = require("axios").default;
const consola = require("consola");
const cors = require("cors");
const nlpRouter = require("./nlp");
const app = express();

app.use(cors());
app.disable("x-powered-by");
app.use(express.json());

app.use("/analyze", nlpRouter);

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
    // https://quickdrawfiles.appspot.com/drawing/car?id={1}&key={key}&format=%22canvas%22
    const set = quickDraw.set(intents.length, intents);
    consola.info(set);
    res.json(set);
  } catch (err) {
    consola.error(err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});
app.listen(8080, () => {
  console.log("API started on port 8080");
});
