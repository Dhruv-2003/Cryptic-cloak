// create a basic http server using express
const express = require("express");
const bodyParser = require("body-parser");
const { getMetaAddress } = require("./main.js");
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
    const data = getMetaAddress(spendingKey, viewingKey);
    res.status(201).send({ data });
  } catch (error) {
    console.log(error);
  }

  res.send("Hello World");
});

// listen for requests
app.listen(3030, () => {
  console.log("Server is listening on port 3030");
});
