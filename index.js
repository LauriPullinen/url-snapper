var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var mongoose = require("mongoose");
var shortid = require("shortid");

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
	var url = URL.findOne({ title: request.params.link }, handleDBError);
	if(url && url.url) {
		response.redirect(301, url.url);
	} else {
		response.status(404).end();
	}
});

app.post("/", function(request, response) {
	// Validate the request, it should have an URL to shorten
	if(!request.body.url) {
		response.status(400);
		response.set("Content-Type", "text/plain");
		return response.send("No URL found in your request");
	}

	response.status(200);
	response.set("Content-Type", "text/plain");
	// Storing a new shortened URL into the database
	var newURL = new URL({
		id: shortid.generate(),
		url: request.body.url,
	});
	newURL.save(handleDBError);
	response.send(request.protocol + "://" + request.headers.host + newURL.id);
});

var port = process.env.PORT || 1337;
var server = app.listen(port, function () {
  var host = server.address().address;
  console.log("Server listening at http://%s:%s", host, port);
});


var db = mongoose.connection;
var dbURI = process.env.MONGOLAB_URI || "mongodb://localhost/url-database";
mongoose.connect(dbURI, function(error, result) {
	if(error) {
		console.error("Error connecting to " + dbURI);
	} else {
		console.log("Connected to " + dbURI);
	}
});

// Defining the URL model
var URL;
db.once("open", function() {
	var urlSchema = new mongoose.Schema({
		id: String,
		url: String,
		createdAt: {type: Date, default: Date.now}
	});
	URL = mongoose.model("URL", urlSchema);
});

// Function for logging the errors in database operations
function handleDBError(error, item) {
	if(error) {
		console.error("Database error with item " + JSON.stringify(item));
		return console.error(error);
	}
}
