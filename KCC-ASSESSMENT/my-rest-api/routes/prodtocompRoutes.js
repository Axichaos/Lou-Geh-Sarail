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

router.post("/insert", (req,res) => {
    var sql = `INSERT INTO prodtocomplink(productid,componentid) VALUES(?,?)`;
    const {productid, componentid} = req.body;
    con.query(sql,[productid,componentid], function(err,result) {
        if(err) throw err;
    });
    res.status(200).send({message: `Inserted record`});
});

router.post("/deletewithpid", (req,res) => {
    var sql = `DELETE FROM prodtocomplink WHERE productid = ?`;
    const {productid} = req.body;
    con.query(sql,[productid], function(err,result) {
        if(err) throw err;
        res.status(200).send({message: `Deleted record`});
    });
})

    

module.exports = router;