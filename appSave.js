const express = require('express')
const mysql = require("mysql");
const port = 8080

var app = express()

// MOVIES 
app.get('/movies', function(req, res) {
	selectAllFilmsPromise
		.then((movies) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(movies));
			res.end();
		})
		.catch((error) => console.log(error));
})

// GENRES
app.get('/genres', function(req, res) {
	selectAllGenresPromise
		.then((genres) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(genres));
			res.end();
		})
		.catch((error) => console.log(error));
})

// DDURS
app.get('/ddurs', function(req, res) {
	selectAllDDurPromise
		.then((ddurs) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(ddurs));
			res.end();
		})
		.catch((error) => console.log(error));
})

// PERSONNES 
app.get('/personnes', function(req, res) {
	selectAllPersonnesPromise
		.then((personnes) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(personnes));
			res.end();
		})
		.catch((error) => console.log(error));
})

// NATIONALITIES 
app.get('/nationalities', function(req, res) {
	selectAllNationalitesPromise
		.then((nationalities) => {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(nationalities));
			res.end();
		})
		.catch((error) => console.log(error));
})

app.listen(port, function () {
  console.log('App listening on port ' + port + '!')
})

// REQUETES
let selectAllFilmsPromise = new Promise(
	(resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 'SELECT * FROM films as f LEFT JOIN ddurs as d ON f.id_ddur = d.id_ddur LEFT JOIN film_genre as fg ON f.id_film = fg.id_film INNER JOIN genres as g ON g.id_genre = fg.id_genre ORDER BY f.titre';

		selectQuery += ' LIMIT 30';

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
});

let selectAllDDurPromise = new Promise(
	(resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 'SELECT * FROM ddurs';

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
});

let selectAllGenresPromise = new Promise(
	(resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 'SELECT * FROM genres';

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
});

let selectAllPersonnesPromise = new Promise(
	(resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 'SELECT * FROM personnes as p LEFT JOIN nationalites as n ON n.id_nationalite = p.id_nationalite';

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
});

let selectAllNationalitesPromise = new Promise(
	(resolve, reject) => {
		var connection = createConnection();

		var selectQuery = 'SELECT * FROM nationalites';

		connection.query(
		  selectQuery,
		  function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      connection.end();
		      reject("No Datas");
		    }

		    closeConnection(connection);

		    resolve(results);
		});
});

// AUTRES FONCTIONS
function createConnection() {
	var connection = mysql.createConnection({
	  host     : "localhost",
	  user     : "root",
	  password : "",
	  database : "films"
	});

	return connection;
}

function closeConnection(connection) {
	connection.end();
}