var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var chatServer = require('./lib/chat_server');

var cache = {};

var server = http.createServer(function(request, response) {
	var filePath = false;
	
	if(request.url == '/') {
		filePath = 'public/index.html';
	} else {
		filePath = 'public' + request.url;
	}
	
	var absPath = './' + filePath;
	serveStatic(response, cache, absPath);
});

server.listen(3000, function() {
	console.log('Server listening on port 3000');
});

chatServer.listen(server);




















//helper functions
/**
 * sends a 404
 */
function send404(res) {
	res.writeHead(404, {'Content-Type': 'text/plain'});
	res.write('Error 404: resource not found');
	res.end();
}

/**
 * sends the content of the file
 * @param response
 * @param filePath
 * @param fileContents
 */
function sendFile(response, filePath, fileContents) {
	response.writeHead(200, {'content-type': mime.lookup(path.basename(filePath))});
	response.end(fileContents);
}

/**
 * serves a static file. Uses the cache to speed it up
 * @param response
 * @param cache
 * @param absPath
 */
function serveStatic(response, cache, absPath) {
	if(cache[absPath]) {
		sendFile(response, absPath, cache[absPath]);
	} else {
		fs.exists(absPath, function(exists) {
			if(exists) {
				fs.readFile(absPath, function(error, data) {
					if(error) {
						send404(response);
					} else {
						cache[absPath] = data;
						sendFile(response, absPath, data);
					}
				});
			} else {
				send404(response);
			}
		});
	}
}