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
var RateLimit = require('express-rate-limit');
var limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});
const { MongoClient } = require('mongodb')
const cdb = new MongoClient(process.env.URI);
const db = cdb.db("url_service");
const storeUrls = db.collection('urls');

app.use(cors());
app.use(limiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));


app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint

let urls = [];
let num = 0;


app.post('/api/shorturl', function (req, res) {
  let urlString;
  if (req.body.url !== undefined) {
    urlString = req.body.url;
  }
  if (req.body.original_url !== undefined) {
    urlString = req.body.original_url;
  }

  try {
    const parsedUrl = new URL(urlString);

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return res.json({ error: "invalid url" });
    }

    dns.lookup(parsedUrl.hostname, async (err) => {

      if (err) {
        return res.json({ error: "invalid url" });
      }

      const countUrls = await storeUrls.countDocuments({}) + 1;

      const urlStore = {
        original_url: urlString,
        short_url: countUrls
      };

      await storeUrls.insertOne(urlStore);

      res.json({
        original_url: urlString,
        short_url: countUrls
      });
    });

  } catch {
    res.json({ error: "invalid url" });
  }

  /*  const urlRegex = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
   const url = req.body.url;
   if (url.match(urlRegex)) {
     num++;
     urls.push({ short_url: num, original_url: url });
     res.json({ original_url: url, short_url: num });
   } else {
     res.json({ error: 'invalid URL' });
   } */

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

app.get("/api/shorturl/:short_url", async (req, res) => {

  const shorturl = req.params.short_url;
  const urlStore = await storeUrls.findOne({ short_url: +shorturl })
  res.redirect(urlStore.urlString);
  /*   const short = parseInt(req.params.short_url);
    const url = urls.find(data => data.short_url === short);
    if (url) {
      res.redirect(url.original_url);
    } else {
      res.json({ error: 'invalid URL' });
    } */
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
