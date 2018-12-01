var sqlite3 = require("sqlite3");
var dhash = require("dhash-image");
var db = new sqlite3.Database('db.sqlite');

function findTheShit(path, callback) {
    // open a file called "lenna.png"
    getDHash(path, (imgHash, err) => {
        if (imgHash == null) {
            callback(new Error("bad img format (or missing)", null, null));
            return;
        }
        getAllTheShitFromTheDatabase((err, rows) => {
            if (err != null) {
                callback(err, null, null);
                return;
            }

            getMinDiffForTheShit(rows, imgHash, (diff, id) => {
                db.serialize(() => {
                    let sql = db.prepare("SELECT * FROM Comics WHERE num = $rowid");
                    sql.get({ $rowid: id }, (err, row) => {
                        sql.finalize();
                        callback(err, diff, row);
                    });
                });
            });
        });
    });
}

function getDHash(path, callback) {
    dhash(path, (err, hash) => {
        if (err) {
            callback(null);
            return;
        }
        callback(hash);
    });
}

function getMinDiffForTheShit(rows, hash, callback, curMin = Infinity, curMinID = -1) {
    if (rows.length == 0) {
        callback(curMin, curMinID);
        return;
    }

    let diff = getTheDiffForTheShit(new Buffer(rows[0].hash, "base64"), hash);

    if (diff < curMin) {
        getMinDiffForTheShit(rows.slice(1), hash, callback, diff, rows[0].num);
    } else {
        getMinDiffForTheShit(rows.slice(1), hash, callback, curMin, curMinID);
    }
}

function getTheDiffForTheShit(hash1, hash2) {
    var distance = 0;
    for (var i = 0; i < hash1.length; i++) {
        if (hash1[i] != hash2[i]) distance++;
    }
    return distance;
}

function getAllTheShitFromTheDatabase(callback) {
    db.serialize(() => {

        db.all("SELECT num, hash FROM Comics;", {}, (err, shit) => {
            callback(err, shit);
        });

    });
}

/* findTheShit("./shawn.jpg", (err, diff, id) => {
    console.log(diff);
    console.log(err);
    console.log(id);
}); */

module.exports.findTheShit = findTheShit;