const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const findShit = require("./findShit.js");
const upload = multer({ dest: 'public/uploads' }).single('photo');
const exphbs = require('express-handlebars');

const app = express();

app.engine('handlebars', exphbs({}));
app.set('view engine', 'handlebars');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});

app.post('/upload', upload, (req, res) => {
  if (!req.file) {
    throw new Error('no file');
  } else {
    findShit.findTheShit(req.file.path, (err, diff, row) => {
      res.type("text/html");
      res.render("image", {
        img: row.img,
        ori: req.file.path.substring(req.file.path.lastIndexOf("/uploads")),
        num: row.num,
        title: row.title
      });
    });
  }
});

console.log("Listening on port 8080");

app.listen(8080);

module.exports = app;