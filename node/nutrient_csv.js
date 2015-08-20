var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('usda.sql3');

db.serialize(function() {
  db.each("select * from food limit 5", function(err, row) {
    console.log(row.long_desc);
  });
});

db.close();
