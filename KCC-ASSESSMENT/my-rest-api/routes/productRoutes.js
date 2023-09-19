const express = require("express");
const router  = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.sqljson);

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
})
router.use(express.json());

router.get("/show", (req,res) => {
    var sql = "SELECT * FROM product";
    con.query(sql, function (err,results,fields) {
        if(err) throw err;
        res.status(200).send(results);
    })
});

router.post("/insert", (req,res) => {
    var sql = `INSERT INTO product(productname,quantity) VALUES(?,?)`;
    const {productname, quantity} = req.body;
    con.query(sql,[productname,quantity], function(err,result) {
        if(err) throw err;
    });
    res.status(200).send({message: `Inserted record`});
});

router.post("/delete", (req,res) => {
    var sql = `DELETE FROM product WHERE productid = ?`;
    const {productid} = req.body;
    con.query(sql,[productid], function(err,result) {
        if(err) throw err;
    });
    res.status(200).send({message: `Deleted record`});
});

router.post("/update", (req,res) => {
    var sql = `UPDATE product SET productname = ?, quantity = ? WHERE productid = ?`;
    const {productname, quantity, productid} = req.body;
    con.query(sql,[productname,quantity,productid], function(err,result) {
        if(err) throw err;
    });
    res.status(200).send({message: `Updated record`});
});

router.get("/showlast", (req,res) => {
    var sql = "SELECT productid FROM product ORDER BY productid DESC LIMIT 1";
    con.query(sql, function (err,results,fields) {
        if(err) throw err;
        res.status(200).send(results);
    })
});

module.exports = router;