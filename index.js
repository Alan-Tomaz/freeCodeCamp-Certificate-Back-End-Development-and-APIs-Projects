require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const multer = require('multer');
// Basic Configuration
const port = process.env.PORT || 3000;
const dns = require("dns");
const { URL } = require("url");

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));


app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint

let urls = [];


app.post("/api/shorturl", function (req, res) {
  const { original_url } = req.body;

  try {
    const url = new URL(original_url);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return res.json({ error: "invalid url" });
    }

    dns.lookup(url.hostname, (err) => {
      if (err) {
        console.log("B")
        return res.json({ error: "invalid url" });
      }

      const short_url = urls.length + 1;

      urlObj = {
        original_url: original_url,
        short_url
      };

      urls.push(urlObj);



      res.json(urlObj);
    });

  } catch (err) {
    console.log(err)
    res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:shorturl", (req, res) => {
  const shortUrlNumber = Number(req.params.shorturl);

  const found = urls.find(u => u.short_url === shortUrlNumber);

  if (!found) {
    return res.json({ error: "No short URL found" });
  }

  res.redirect(found.original_url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
