var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send('GET request!!');
});
app.post('/', function(req, res) {
    res.send('Got a POST request');
});
app.put('/user', function(req, res) {
    res.send('Got a PUT request at /user');
});
app.delete('/user', function(req, res) {
    res.send('Got a DELETE request at /user');
});

app.get('/hola.json', function(req, res){
  // Indicamos el tipo de contenido a devolver en las cabeceras de nuestra respuesta
  res.contentType('application/json');
  res.sendfile(__dirname + '/mocks/mock.json');
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
