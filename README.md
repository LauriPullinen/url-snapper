# URL Snapper

This is an introductory project to node.js and MongoDB. The service offers a simple HTTP API for shortening URLs. 
Shortening is done by sending a POST '/' request with the URL as a parameter called "link". The service returns an 
identifier string as plain text.

The identifiers are used as parameters for GET requests of the form '/id'. The service returns a 301 HTTP redirect to
the URL previously saved to the database. If no URL with the given identifier is found, a 404 not found is returned
in stead.

The service also has a HTML based user interface for use through a browser. A demo deployed to Heroku can be found
here: http://url-snapper.herokuapp.com
