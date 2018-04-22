const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();

// API file for interacting with MongoDB
const api = require('./server/routes/api');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

// API location
app.use('/api', api);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//Set Port
const server_port = process.env.PORT || '3000';
const server_host = '0.0.0.0';

app.set('port', process.env.PORT);
app.set('host', server_host);

const server = http.createServer(app);

server.listen(process.env.PORT, '0.0.0.0', function() {
    console.log(`Listening on port: ${process.env.PORT}`)
});
//