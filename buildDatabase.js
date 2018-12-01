var request = require("request");
var sqlite3 = require("sqlite3");
var dhash = require('dhash-image');
var fs = require("fs");
var db = new sqlite3.Database('db.sqlite');

const startIndex = 2079;

function insertImage(body, callback) {
  db.serialize(() => {
    let sql = db.prepare("INSERT INTO Comics (month, link, year, transcript, alt, img, title, day, hash) VALUES ($month, $link, $year, $transcript, $alt, $img, $title, $day, $hash)");

    sql.run({
      $month: parseInt(body.month, 10),
      $link: body.link,
      $year: parseInt(body.year, 10),
      $transcript: body.transcript,
      $alt: body.alt,
      $img: body.img,
      $title: body.title,
      $day: parseInt(body.day, 10),
      $hash: body.hash
    });
    sql.finalize();
    callback();

  });

}

function downloadImage(uri, callback) {
  request.head(uri, function (err, res, body) {
    if ("./images/" + uri.substring(uri.lastIndexOf("/") + 1) == "./images/") {
      callback(null);
      return;
    }
    try {
      request(uri).pipe(fs.createWriteStream("./images/" + uri.substring(uri.lastIndexOf("/") + 1))).on('close', () => {
        callback("./images/" + uri.substring(uri.lastIndexOf("/")));
      });
    } catch (e) {
      callback(null);
    }
  });
};

function getDHash(uri, callback) {
  downloadImage(uri, (path) => {
    if (path == null) {
      callback(null);
      return;
    }
    dhash(path, function (err, hash) {
      if (err) {
        callback(null);
        return;
      }
      callback(hash);
    });
  });
}

function loadImages(index) {
  if (index == 0) {
    db.close();
    return;
  }

  request(`https://xkcd.com/${index}/info.0.json`, function (error, response, body) {
    if (body.charAt(0) == "<") {
      loadImages(index - 1);
      return;
    }
    let json = JSON.parse(body);
    console.log(index);
    getDHash(json.img, (hash) => {
      if (hash == null) {
        loadImages(index - 1);
        return;
      }
      json.hash = hash.toString('base64');
      insertImage(json, () => {
        loadImages(index - 1);
      });
    });
  });
}

loadImages(startIndex);