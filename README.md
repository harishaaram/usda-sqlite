# USDA database to SQLite

Converts the USDA food database to SQLite.

The USDA has a database of nutritional information for many foods available at:

  http://www.ars.usda.gov/Services/docs.htm?docid=8964

By default it's contained in flat files. This project includes scripts to generate appropriate schema and import them into a SQLite database. I've also hand generated a subset of the nutrients that includes commonly-familiar nutrients vs. the very extensive list provided by the USDA.

Some example scripts to query the databaseare in the `example` folder. Sample usage:
```sh
$ python example/nutrition.py 01001
$ python example/search.py salmon
```

## Useful queries

#### Get all nutrient data for Dairy and Egg Products
```
select count(*) from nutrition join food on food.id = nutrition.food_id where food.food_group_id = 100;
```

#### Populating Database

A database is included in the repo for SR27.

To re-populate the database from scratch, you will need to first download the files and unzip them into the `data` directory. Files for SR27 are included. 

Run create_db.sh with the name of output database:
```sh
$ ./create_db.sh usda.sql3
```

## SQLlite browser
I recommend using the open source [sqlitebrowser](http://sqlitebrowser.org/) to view the database.
![sqllitebrowser_screenshot](
https://github.com/sqlitebrowser/sqlitebrowser/raw/master/images/sqlitebrowser.png)

## Attribution
Adapted from <https://github.com/czarandy/usda> for scripts to run on Mac OS X with SR27 release by [Alyssa Quek](https://github.com/alyssaq).
