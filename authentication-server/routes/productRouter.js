const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/hackathon";
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbase = db.db("hackathon"); //here

    dbase
      .collection("Shop")
      .find({}, { projection: { "products.name": 1, _id: 0 } })
      .toArray(function(err, result) {
        if (err) throw err;
        // console.log(result[0].products[0].name);

        let products = [];

        for (let i = 0; i < result.length; i++) {
          products.push(result[i].products[0].name);
        }
        // console.log(products);

        const filteredProducts = products.filter(function(item, pos) {
          return products.indexOf(item) == pos;
        });
        db.close();
        console.log(filteredProducts);
        res.jsonp({
          products: filteredProducts
        });
      });
  });
});

module.exports = router;
