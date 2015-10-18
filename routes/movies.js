var express = require('express'); // Express App include
var mysql = require('mysql'); // Mysql include

var router = express.Router();

var connection = mysql.createConnection({ // Mysql Connection
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'imdb',
});

// get movies with directors, roles and actors
var query_movie_1 = "SELECT m.id, m.name, m.year, m.rank, d.id AS 'director_id', r.role, a.id AS 'actor_id' from movies m ";
var query_movie_2 = "JOIN movies_directors md ON md.movie_id = m.id ";
var query_movie_3 = "JOIN directors d ON d.id = md.director_id ";
var query_movie_4 = "JOIN roles r ON r.movie_id = m.id JOIN actors a ON a.id = r.actor_id "; 
var query_movie_5 = "ORDER BY m.id limit 1000;";
router.route('/').get(function(req, res) {
    connection.query(query_movie_1 + query_movie_2 + query_movie_3 + query_movie_4 + query_movie_5, function(err, rows, fields) {
        if (err) {
            console.log(err);
            throw err;
        };
        if (rows.length != 0) {
            var movies = [];
            rows.forEach(function(row) {
                var find = false;
                var director_find = false;
                movies.forEach(function(m) {
                    if (m._id === row.id) {
                        m.directors.forEach(function(d){
                            if (d === row.director_id) {
                                director_find = true;                                
                            };
                        });
                        if (!director_find) {
                            m.directors.push(row.director_id);
                        };
                        var role = {
                             role: row.role, 
                             id_actor: row.actor_id
                        };
                        m.roles.push(role);
                        find = true;
                    };
                });
                if (!find) {
                    var movie = {};
                    movie._id = row.id;
                    movie.name = row.name;
                    movie.year = row.year;
                    movie.rank = row.rank;
                    movie.directors = [];
                    movie.directors.push(row.director_id);
                    movie.roles = [];                   
                    var role = {
                        role: row.role, 
                        id_actor: row.actor_id,
                    };
                    movie.roles.push(role);
                    movies.push(movie);
                };
            });
            res.json(movies);
        } else{
            res.json({message: 'no books found...'});
        };
    });
});

// get movies with roles and actors
var query_roles_1 = "SELECT m.id, m.name, m.year, m.rank, r.role, a.id AS 'actor_id' from movies m ";
var query_roles_2 = "JOIN roles r ON r.movie_id = m.id JOIN actors a ON a.id = r.actor_id "; 
var query_roles_3 = "ORDER BY m.id limit 10;";
router.route('/roles').get(function(req, res) {
    connection.query(query_roles_1 + query_roles_2 + query_roles_3, function(err, rows, fields) {
        if (err) {
            console.log(err);
            throw err;
        };
        if (rows.length != 0) {
            var movies = [];
            rows.forEach(function(row) {
                var find = false;
                movies.forEach(function(m) {
                    if (m._id === row.id) {
                        var role = {
                             role: row.role, 
                             id_actor: row.actor_id
                        };
                        m.roles.push(role);
                        find = true;
                    };
                });
                if (!find) {
                    var movie = {};
                    movie._id = row.id;
                    movie.name = row.name;
                    movie.year = row.year;
                    movie.rank = row.rank;
                    movie.roles = [];
                    var role = {
                        role: row.role, 
                        id_actor: row.actor_id                           
                    };
                    movie.roles.push(role);
                    movies.push(movie);
                };
            });
            res.json(movies);
        } else{
            res.json({message: 'no books found...'});
        };
    });
});

// get movies with directors
var query_dir_1 = "SELECT m.id, m.name, m.year, m.rank, d.id AS 'director_id', d.first_name, d.last_name from movies m ";
var query_dir_2 = "JOIN movies_directors md ON md.movie_id = m.id ";
var query_dir_3 = "JOIN directors d ON d.id = md.director_id "; 
var query_dir_4 = "ORDER BY m.id limit 10;";
router.route('/directors').get(function(req, res) {
    connection.query(query_dir_1 + query_dir_2 + query_dir_3 + query_dir_4, function(err, rows, fields) {
        if (err) {
            console.log(err);
            throw err;
        };
        if (rows.length != 0) {
            var movies = [];
            rows.forEach(function(row) {
                var find = false;
                movies.forEach(function(m) {
                    if (m._id === row.id) {                   
                        m.directors.push(row.director_id);
                        find = true;                                
                    }
                });
                if (!find) {
                    var movie = {};
                    movie._id = row.id;
                    movie.name = row.name;
                    movie.year = row.year;
                    movie.rank = row.rank;
                    movie.directors = [];
                    movie.directors.push(row.director_id);                
                    movies.push(movie);
                };
            });
            res.json(movies);
        } else{
            res.json({message: 'no books found...'});
        };
    });
});

// insert a movie
router.route('/').post(function(req, res){

    var input = JSON.parse(JSON.stringify(req.body));

    var data = {
    	id: input.id,
        name : input.name,
        year : input.year,
        rank : input.rank
    };

    connection.query("insert into movies set ? ", data, function(err, rows, fields){
        if (err){
            console.log(err);
            throw err;
        }
        
        res.json({message: 'movie inserted with success..'});
    });
});

router.route('/:id').put(function(req, res){
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;

    var data = {
        name : input.name,
        year : input.year,
        rank : input.rank
    };

    connection.query("update movies set ? where id = ?", [data, id], function(err, rows, fields) {
        if (err) {
            console.log(err);
            throw err;
        };

        res.json({message : 'movie updated with success'});
    });
});

router.route('/:id').delete(function(req, res){
    var id = req.params.id;

    connection.query("delete from movies where id = ?", id, function(err, rows, fields) {
        if (err) {
            console.log(err);
            throw err;
        };

        res.json({message : 'movie deleted with success'});
    });
});

module.exports = router;