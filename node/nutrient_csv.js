var sqlite3 = require('sqlite3').verbose();
var d3 = require('d3');

var db = new sqlite3.Database('usda.sql3');

var foodLookup = {};
var nutrientLookup = {};
var nutdata = [];

db.serialize(function() {
  db.each("select * from food", function(err, row) {
    foodLookup[row.id] = row;
  });

  db.each("select * from nutrient", function(err, row) {
    nutrientLookup[row.id] = row;
  });

  db.each("select * from nutrition", function(err, row) {
    var nutrient = nutrientLookup[row.nutrient_id];
    foodLookup[row.food_id][nutrient.name + " (" + nutrient.units+ ")"] = row.amount;
  }, function() {
    var values = d3.values(foodLookup);
    d3.values(nutrientLookup).forEach(function(nut) {
      values[0][nut.name + " (" + nut.units+ ")"] = values[0][nut.name + " (" + nut.units+ ")"] || null;
    });
    console.log(d3.csv.format(values));
  });
});

db.close();
