var express = require('express'); // Express App include
var mysql = require('mysql'); // Mysql include

var router = express.Router();

var connection = mysql.createConnection({ // Mysql Connection
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'imdb',
});

router.route('/').get(function (req, res) {
	res.json({ message: 'IMDB API'});
});

router.route('/directors').get(function(req,res){

    connection.query("select * from directors",function(err, rows, fields){
        if(rows.length != 0){
            res.json(rows);
        }else{
            res.json({message: 'no books found..'});
        }
    });
});

module.exports = router;