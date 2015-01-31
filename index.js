var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");


var port = process.env.PORT || 1337;
var app = express();

app.use(bodyParser.urlencoded({
	extended: true 
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(request, response) {
	response.status(200);
	response.set("Content-Type", "text/plain");
	response.send("Front page");
});

app.get("/:id", function(request, response) {
	response.status(200);
	response.set("Content-Type", "text/plain");
	response.send("GET parameter: " + request.params.id);
});

app.post("/", function(request, response) {
	response.status(200);
	response.set("Content-Type", "text/plain");
	response.send("POST parameters: " + JSON.stringify(request.params));
});

var server = app.listen(port, function () {
  var host = server.address().address;
  console.log("Server listening at http://%s:%s", host, port);
});