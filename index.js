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
let num = 0;


app.post("/api/shorturl", async function (req, res) {

  const urlRegex = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  const url = req.body.url;
  if (url.match(urlRegex)) {
    num++;
    urls.push({ short_url: num, original_url: url });
    res.json({ original_url: url, short_url: num });
  } else {
    res.json({ error: 'invalid URL' });
  }

  /*   const urlString = req.body.url;
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
    }) */

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

app.get('/api/shorturl/:short_url', (req, res) => {
  const short = parseInt(req.params.short_url);
  const url = urls.find(data => data.short_url === short);
  if (url) {
    res.redirect(url.original_url);
  } else {
    res.json({ error: 'invalid URL' });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
