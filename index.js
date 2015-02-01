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

var port = process.env.PORT || 1337;
var server = app.listen(port, function () {
  var host = server.address().address;
  console.log("Server listening at http://%s:%s", host, port);
});


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
	var urlSchema = new mongoose.Schema({
		id: String,
		link: String,
		createdAt: {type: Date, default: Date.now}
	});
	var URL = mongoose.model("URL", urlSchema);

	app.get("/:id", function(request, response) {
		URL.find(function (err, urls) {
		  if (err) return console.error(err);
		  console.log(urls)
		});
		console.log("Searching by id: " + request.params.id);
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

	app.post("/", function(request, response) {
		// Validate the request, it should have an URL to shorten
		if(!request.body.link) {
			response.status(400);
			response.set("Content-Type", "text/plain");
			return response.send("No URL found in your request");
		}

		response.status(200);
		response.set("Content-Type", "text/plain");
		// Storing a new shortened URL into the database
		var newURL = new URL({
			id: shortid.generate(),
			link: request.body.link,
		});
		newURL.save(handleDBError);
		response.send(request.protocol + "://" + request.headers.host + "/" + 
			newURL.id);
	});
});

// Function for logging the errors in database operations
function handleDBError(error, item) {
	if(error) {
		console.error("Database error with item " + JSON.stringify(item));
		return console.error(error);
	}
}
