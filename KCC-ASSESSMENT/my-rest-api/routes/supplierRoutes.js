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
    var sql = "SELECT * FROM supplier";
    con.query(sql, function (err,results,fields) {
        if(err) throw err;
        res.status(200).send(results);
    })
});

router.post("/insert", (req,res) => {
    var sql = `INSERT INTO supplier(suppliername) VALUES(?)`;
    const {suppliername} = req.body;
    con.query(sql,[suppliername], function(err,result) {
        if(err) throw err;
        res.status(200).send({"message": "Inserted Data"});
    });
});

router.post("/showwithcid", (req,res) => {
    var sql = `SELECT supplier.supplierid,supplier.suppliername FROM supplier INNER JOIN comptosupplink ON supplier.supplierid = comptosupplink.supplierid WHERE comptosupplink.componentid = ?`;
    const {componentid} = req.body;
    con.query(sql,[componentid], function(err,result) {
        if(err) throw err;
        res.status(200).send(result);
    });
});

router.post("/update", (req,res) => {
    var sql = `UPDATE supplier SET suppliername = ? WHERE supplierid = ?`;
    const {suppliername, supplierid} = req.body;
    con.query(sql,[suppliername,supplierid], function(err,result) {
        if(err) throw err;
    });
    res.status(200).send({message: `Updated record`});
});

router.post("/delete", (req,res) => {
    var sql = `DELETE FROM supplier WHERE supplierid = ?`;
    const {supplierid} = req.body;
    con.query(sql,[supplierid], function(err,result) {
        if(err) throw err;
    });
    res.status(200).send({message: `Deleted record`});
});

module.exports = router;