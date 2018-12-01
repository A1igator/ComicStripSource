const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const dhash = require('dhash-image');

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

hamming = (a, b) => {
  buf1 = Buffer.from(a, 'base64');
  buf2 = Buffer.from(b, 'base64');
  let distance = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] != b[i]) distance++;
  }
  console.log(distance);
  return distance;
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});

app.post('/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    throw new Error('no file');
  } else {
    const buffer = new Buffer(req.file.path);
    dhash(req.file.path, (err, hash) => {
      if (!err) {
        console.log(hash.toString('base64'));
      } else {
        console.log(err);
      }
    });
  }
});

app.listen('8080');

module.exports = app;