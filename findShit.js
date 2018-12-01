var sqlite3 = require("sqlite3");
var dhash = require("dhash-image");
var db = new sqlite3.Database('db.sqlite');

function findTheShit(path, callback) {
    getDHash(path, (imgHash) => {
        getAllTheShitFromTheDatabase((err, rows) => {
            if (err != null) {
                callback(err, null);
                return;
            }

            getMinDiffForTheShit(rows, imgHash, (diff, id) => {
                callback(null, diff, id);
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
        getMinDiffForTheShit(rows.slice(1), hash, callback, diff, rows[0].rowid);
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

        db.all("SELECT _ROWID_, hash FROM Comics;", {}, (err, shit) => {
            callback(err, shit);
        });

    });
}

findTheShit("./comic.png", (err, diff, id) => {
    console.log(err);
    console.log(diff);
    console.log(id);
});

module.exports.findTheShit = findTheShit;