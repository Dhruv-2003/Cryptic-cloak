// create a basic http server using express
const express = require("express");
const bodyParser = require("body-parser");
const {
  getMetaAddress,
  getStealthAddress,
  revealStealthKey,
  revealStealthKeyNoFile,
  checkStealth,
} = require("./main.js");
const app = express();
var cors = require("cors");
app.use(cors());
app.use(bodyParser.json());

// create a basic route
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/getMetadataAddress", async (req, res) => {
  console.log(req.body);
  const { spendingKey, viewingKey } = req.body;

  try {
    const data = await getMetaAddress(spendingKey, viewingKey);
    console.log(data);
    res.status(201).send({ data });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "error" });
  }
});

app.post("/getStealthAddress", async (req, res) => {
  console.log(req.body);
  const { metaAddress } = req.body;

  try {
    const data = await getStealthAddress(metaAddress);
    console.log(data);
    res.status(201).send({ data });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "error" });
  }
});

app.post("/revealStealthKeyNoFile", async (req, res) => {
  console.log(req.body);
  const { spendingKey, viewingKey, stealthAddress, ephemeralPublicKey } =
    req.body;

  try {
    const data = await revealStealthKeyNoFile(
      spendingKey,
      viewingKey,
      stealthAddress,
      ephemeralPublicKey
    );
    console.log(data);
    res.status(201).send({ data });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "error" });
  }
});

app.post("/checkStealth", async (req, res) => {
  console.log(req.body);
  const {
    spendingKey,
    viewingKey,
    stealthAddress,
    ephemeralPublicKey,
    viewTag,
  } = req.body;

  try {
    const data = await checkStealth(
      spendingKey,
      viewingKey,
      stealthAddress,
      ephemeralPublicKey,
      viewTag
    );
    console.log(data);
    res.status(201).send({ data });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "error" });
  }
});

// listen for requests
app.listen(3030, () => {
  console.log("Server is listening on port 3030");
});
