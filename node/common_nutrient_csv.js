var sqlite3 = require('sqlite3').verbose();
var d3 = require('d3');

var db = new sqlite3.Database('usda.sql3');

var foodLookup = {};
var nutrientLookup = {};
var foodgroupLookup = {};
var common_nutrients = {};
var nutdata = [];

db.serialize(function() {
  db.each("select * from nutrient", function(err, row) {
    nutrientLookup[row.id] = row;
  });

  db.each("select * from common_nutrient", function(err, row) {
    common_nutrients[row.id] = row;
  });

  db.each("select * from food_group", function(err, row) {
    foodgroupLookup[row.id] = row;
  });

  db.each("select * from food", function(err, row) {
    foodLookup[row.id] = row;
    foodLookup[row.id]["food_group"] = foodgroupLookup[row.food_group_id].name;
  });

  db.each("select * from nutrition", function(err, row) {
    // skip non-common nutrients
    if (!(row.nutrient_id in common_nutrients)) return;

    // save nutrient value to food object
    var nutrient = nutrientLookup[row.nutrient_id];
    foodLookup[row.food_id][nutrient.name + " (" + nutrient.units+ ")"] = row.amount;

  }, function() {
    // turn foods object into array
    var values = d3.values(foodLookup);

    // make sure first row has every common nutrient, even if null
    // so that d3.csv.format will include them all as headers
    d3.values(nutrientLookup)
      .filter(function(nut) {
        return !(nut.id in common_nutrients) ? false : true;
      })
      .forEach(function(nut) {
        values[0][nut.name + " (" + nut.units+ ")"] = values[0][nut.name + " (" + nut.units+ ")"] || null;
      });

    console.log(d3.csv.format(values));
  });
});

db.close();
