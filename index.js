require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const multer = require('multer');
// Basic Configuration
const port = process.env.PORT || 3000;
const dns = require("dns");
/* const { URL} = require("url"); */
const urlparser = require("url");


app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));


app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint

let urls = [];


app.post("/api/shorturl", function (req, res) {
  const urlString = req.body.url;
  const lookDns = dns.lookup(urlparser.parse(urlString).hostname, async (req, validAddress) => {
    if (!validAddress) {
      res.json({ error: "Invalid URL" })
    } else {
      const short_url = urls.length + 1;

      urlObj = {
        original_url: urlString.trim(),
        short_url
      };

      urls.push(urlObj);


      console.log("URL OBJECT:", urlObj)
      res.json(urlObj);
    }
  })

  /*   const { url } = req.body;
    console.log("URL SALVA:", url)
  
    try {
      const urlObject = new URL(url);
  
      if (urlObject.protocol !== "http:" && urlObject.protocol !== "https:") {
        return res.json({ error: "invalid url" });
      }
  
      dns.lookup(urlObject.hostname, (err) => {
        if (err) {
          console.log("B")
          return res.status(400).json({ error: "invalid url" });
        }
  
      
      });
  
    } catch (err) {
      console.log(err)
      res.status(400).json({ error: "invalid url" });
    }
   */
});

app.get("/api/shorturl/:short_url", (req, res) => {
  console.log("PARAMS:", req.params)

  const shortUrlNumber = Number(req.params.short_url);

  const found = urls.find(u => u.short_url === shortUrlNumber);

  if (!found) {
    return res.status(404).json({ error: "No short URL found" });
  }

  console.log("URL ENCONTRADA:", found)
  res.redirect(302, found.original_url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
