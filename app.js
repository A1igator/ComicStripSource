const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const dhash = require('dhash-image');
const find = require('./findShit.js');

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

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
    find.findTheShit(req.file.path, (err, diff, row) => {
      if (!err) {
        res.send({
          img: row.img,
          title: row.title,
          year: row.year,
          month: row.month,
          day: row.day
        });
      }
    })
  }
});

app.listen('8080');

module.exports = app;