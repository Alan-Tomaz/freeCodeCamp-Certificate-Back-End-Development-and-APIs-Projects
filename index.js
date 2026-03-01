require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const multer = require('multer');
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));


app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint

let urls = [];


app.post('/api/shorturl', function (req, res) {
  console.log(req.body);
  const { url } = req.body;
  if (stringIsAValidUrl(url)) {

    const short_url = urls.length + 1;

    saveUrls(url);

    res.json({
      original_url: url,
      short_url
    });
  } else {
    res.json({ error: 'invalid url' });
  }
});

app.get("/api/shorturl/:shorturl", (req, res) => {
  console.log(req.params.shorturl);

  const shortUrlNumber = Number(req.params.shorturl);

  const foundUrl = readUrls(shortUrlNumber);

  if (!foundUrl) {
    return res.status(404).json({ error: "URL não encontrada" });
  }

  res.redirect(foundUrl);
});

function saveUrls(url) {
  urls.push(url)
  console.log(urls)
}

function readUrls(index) {

  return urls[index - 1];
}

const stringIsAValidUrl = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
