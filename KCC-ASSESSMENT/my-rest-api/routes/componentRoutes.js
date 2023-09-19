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
    var sql = "SELECT * FROM components";
    con.query(sql, function (err,results,fields) {
        if(err) throw err;
        res.status(200).send(results);
    })
});

router.post("/delete", (req,res) => {
    var sql = `DELETE FROM components WHERE componentid = ?`;
    const {componentid} = req.body;
    con.query(sql,[componentid], function(err,result) {
        if(err) throw err;
    });
    res.status(200).send({message: `Deleted record`});
});

router.post("/insert", (req,res) => {
    var sql = `INSERT INTO components(name,description) VALUES(?,?)`;
    const {name, description} = req.body;
    con.query(sql,[name,description], function(err,result) {
        if(err) throw err;
    });
    res.status(200).send({message: `Inserted record`});
});

router.get("/showlast", (req,res) => {
    var sql = "SELECT componentid FROM components ORDER BY componentid DESC LIMIT 1";
    con.query(sql, function (err,results,fields) {
        if(err) throw err;
        res.status(200).send(results);
    })
});

router.post("/showwithpid", (req,res) => {
    var sql = `SELECT components.componentid,components.name,components.description FROM components INNER JOIN prodtocomplink ON components.componentid = prodtocomplink.componentid WHERE prodtocomplink.productid = ?`;
    const {productid} = req.body;
    con.query(sql,[productid], function(err,result) {
        if(err) throw err;
        res.status(200).send(result);
    });
});

router.post("/update", (req,res) => {
    var sql = `UPDATE components SET name = ?, description = ? WHERE componentid = ?`;
    const {name, description, componentid} = req.body;
    con.query(sql,[name,description,componentid], function(err,result) {
        if(err) throw err;
    });
    res.status(200).send({message: `Updated record`});
});

router.post("/checkiflinked", (req,res) => {
    var sql = `SELECT components.componentid,components.name,components.description FROM components INNER JOIN prodtocomplink ON components.componentid = prodtocomplink.componentid WHERE prodtocomplink.componentid = ?`;
    const {componentid} = req.body;
    con.query(sql,[componentid], function(err,result) {
        if(err) throw err;
        res.status(200).send(result);
    });
});


module.exports = router;