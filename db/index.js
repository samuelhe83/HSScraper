const mysql = require('mysql');

module.exports.connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hearthstone'
});

module.exports.connection.connect();


