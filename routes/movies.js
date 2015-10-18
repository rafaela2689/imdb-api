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
var query_actor = "SELECT m.id, m.name, m.year, m.rank, d.id AS 'director_id', d.first_name, d.last_name, r.role, a.id AS 'actor_id', a.first_name AS 'actor_first_name', a.last_name AS 'actor_last_name', a.gender from movies m ";
var query_actor2 = "JOIN movies_directors md ON md.movie_id = m.id ";
var query_actor3 = "JOIN directors d ON d.id = md.director_id ";
var query_actor4 = "JOIN roles r ON r.movie_id = m.id JOIN actors a ON a.id = r.actor_id "; 
var query_5 = "ORDER BY m.id;";
router.route('/').get(function(req, res) {
    connection.query(query_actor + query_actor2 + query_actor3 + query_actor4 + query_5, function(err, rows, fields) {
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
                            var director = {
                                id_director : row.director_id,
                                first_name : row.first_name,
                                last_name : row.last_name
                            };
                            m.directors.push(director);
                        };
                        var role = {
                             role: row.role, 
                             id_actor: row.actor_id,
                             actor_first_name : row.actor_first_name,
                             actor_last_name : row.actor_last_name,
                             gender : row.gender
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
                    if (row.director_id) {
                        var director = {
                                id_director : row.director_id,
                                first_name : row.first_name,
                                last_name : row.last_name
                        };
                        movie.directors.push(director);    
                    };
                    movie.roles = [];
                    if (row.role || row.actor_id) {
                         var role = {
                             role: row.role, 
                             id_actor: row.actor_id,
                             actor_first_name : row.actor_first_name,
                             actor_last_name : row.actor_last_name,
                             gender : row.gender
                        };
                        movie.roles.push(role);    
                    };
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
var query_actor = "SELECT m.id, m.name, m.year, m.rank, r.role, a.id AS 'actor_id', a.first_name, a.last_name, a.gender from movies m ";
var query_actor4 = "JOIN roles r ON r.movie_id = m.id JOIN actors a ON a.id = r.actor_id "; 
var query_5 = "ORDER BY m.id;";
router.route('/roles').get(function(req, res) {
    connection.query(query_actor + query_actor4 + query_5, function(err, rows, fields) {
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
                             id_actor: row.actor_id,
                             first_name : row.first_name,
                             last_name : row.last_name,
                             gender : row.gender
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
                    if (row.role || row.actor_id) {
                        var role = {
                             role: row.role, 
                             id_actor: row.actor_id,
                             first_name : row.first_name,
                             last_name : row.last_name,
                             gender : row.gender
                        };
                        movie.roles.push(role);    
                    };
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
var query_actor = "SELECT m.id, m.name, m.year, m.rank, d.id AS 'director_id', d.first_name, d.last_name from movies m ";
var query_actor2 = "JOIN movies_directors md ON md.movie_id = m.id ";
var query_actor3 = "JOIN directors d ON d.id = md.director_id "; 
var query_5 = "ORDER BY m.id;";
router.route('/directors').get(function(req, res) {
    connection.query(query_actor + query_actor2 + query_actor3 + query_5, function(err, rows, fields) {
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
                        var director = {
                                id_director : row.director_id,
                                first_name : row.first_name,
                                last_name : row.last_name
                        };
                        m.directors.push(director);
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
                    if (row.director_id) {
                        var director = {
                                id_director : row.director_id,
                                first_name : row.first_name,
                                last_name : row.last_name
                        };
                        movie.directors.push(director);    
                    };
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