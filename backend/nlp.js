const router = require("express").Router();
const language = require("@google-cloud/language");
const consola = require("consola");
const path = require("path");
const categories = require("./categories");

router.post("/", async (req, res) => {
  const { body } = req;

  try {
    const keyFilename = path.join(__dirname, "./keyfile.json");
    const langClient = new language.LanguageServiceClient({ keyFilename });
    consola.info(body);
    const document = {
      content: body.data,
      type: "PLAIN_TEXT",
    };

    const [result] = await langClient.annotateText({
      document,
      features: {
        extractEntities: true,
        extractSyntax: true,
      },
    });
    consola.info(`Token analysis received`);

    const { tokens } = result;
    consola.info(tokens);
    const nounsToAdjectivesMapping = {
      lemmas: [],
      properties: [],
      position: "",
      count: 1,
    };
    tokens
      .filter(({ lemma, partOfSpeech: { tag } }) => {
        if (tag === "NOUN") {
          return categories.includes(lemma);
        }
        return ["ADP", "ADJ", "NUM", "ADV"].includes(tag);
      })
      .forEach(({ lemma, partOfSpeech }) => {
        switch (partOfSpeech.tag) {
          case "ADJ":
          case "ADV":
            nounsToAdjectivesMapping.properties.push(lemma);
            break;
          case "NOUN":
            nounsToAdjectivesMapping.lemmas.push(lemma);
            break;
          case "ADP":
            nounsToAdjectivesMapping.position = lemma;
            break;
          case "NUM":
            nounsToAdjectivesMapping.count = lemma;
            break;
          default:
            break;
        }
      });

    res.status(200).json(nounsToAdjectivesMapping);
  } catch (error) {
    consola.error(error);
    res.status(500).json(error.message);
  }
});

module.exports = router;
