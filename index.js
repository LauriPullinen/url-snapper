var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var mongoose = require("mongoose");
var shortid = require("shortid");

// Defining the application basics
var app = express();
// Parser for url encoded parameters
app.use(bodyParser.urlencoded({
	extended: true 
}));
// Allow access to the public directory
app.use(express.static(path.join(__dirname, 'public')));
// Defining port and starting server
var port = process.env.PORT || 1337;
var server = app.listen(port, function () {
  var host = server.address().address;
  console.log("Server listening at http://%s:%s", host, port);
});

// Defining MongoDB uri and connecting
var dbURI = process.env.MONGOLAB_URI || "mongodb://localhost/url-database";
mongoose.connect(dbURI, function(error, result) {
	if(error) {
		console.error("Error connecting to " + dbURI);
	} else {
		console.log("Connected to " + dbURI);
	}
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
	// MongoDB connection established, define the schema and model for storing
	// the shortened URL info
	var urlSchema = new mongoose.Schema({
		id: String,
		link: String,
		createdAt: {type: Date, default: Date.now}
	});
	var URL = mongoose.model("URL", urlSchema);
	// Response to parametrized GET requests: finds the shortened URL by id 
	// from the database, gets the URL, and redirects to it. Returns a 404 if 
	// no URL is found.
	app.get("/:id", function(request, response) {
		URL.findOne({id: request.params.id}, function(error, result) {
			if(error) {
				console.error(error);
			}
			if(result && result.link) {
				response.redirect(301, result.link);
			} else {
				response.status(404).end();
			}
		});
	});
	// Response to POST requests. A parameter named 'link' is expected, returns
	// a 400 (BadRequest) if not found. Otherwise, generates a new id, stores
	// the id URL pair to the database, and returns the id.
	app.post("/", function(request, response) {
		if(!request.body.link) {
			response.status(400);
			return response.send("No URL found in your request");
		}
		response.status(200);
		response.set("Content-Type", "text/plain");
		var newURL = new URL({
			id: shortid.generate(),
			link: request.body.link,
		});
		newURL.save(function(error) {
			if(error) {
				console.error(error);
			}
		});
		response.send(newURL.id);
	});
});
