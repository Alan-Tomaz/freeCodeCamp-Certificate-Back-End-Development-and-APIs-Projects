require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint

let urls = [];

app.get("/api/shorturl/:shorturl", (req, res) => {

  console.log("Acessando URL encurtada:", req.params.shorturl);

  const shortUrlNumber = Number(req.params.shorturl);

  const foundUrl = readUrls(shortUrlNumber);

  if (foundUrl) {
    return res.status(404).json({ error: "URL não encontrada" });
  }

  res.redirect(foundUrl);
});

app.post('/api/shorturl', function (req, res) {
  const { original_url } = req.body;

  const short_url = urls.length;

  const newUrl = {
    original_url,
    short_url
  };

  saveUrls(original_url);

  res.json(newUrl);
});

function saveUrls(url) {
  urls.push(url)
}

function readUrls(index) {

  return urls[index];
}

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
