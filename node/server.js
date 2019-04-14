"use strict";

var http = require('http');
var url = require('url');

// @link https://github.com/theturtle32/WebSocket-Node
var WebsocketServer = require('websocket').server;

/**
 * There are two types of HTTP requests that can happen
 * @example     1.  In-Server Request
 * @description     * In-Server requests are made by PHP (in Apache server which runs the website) to the Real-time websocket server
 *                  * This is the only way that websocket server can get a message
 *                  * TODO: Users cannot send messages to the websocket server (Password Protect it)
 * @example 	2. 	Client-Websocket Request
 * @description		* This request initiates a websocket connection between the server and the client
 */
var server = http.createServer(function(request,response) {



	// read post paramas
	// TIP: Unlike PHP, Node.js is async
	function getPostParams(request, callback) {
	    var qs = require('querystring');

	    if (request.method == 'POST') {
	        var body = '';

	        request.on('data', function (data) {
	            body += data;

	            // Too much POST data, kill the connection!
	            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
	            if (body.length > 1e6)
	                request.connection.destroy();
	        });

	        request.on('end', function () {
	            var POST = qs.parse(body);
	            callback(POST);
	        });
	    }
	}

    // in-server request from PHP
    if (request.method === "POST") {
    	getPostParams(request, function(POST) {	
			messageClients(POST.data);
			response.writeHead(200);
			response.end();
		});
		return;
	}
});
server.listen(8080);

/* 
	Handling websocket requests
*/
var websocketServer = new WebsocketServer({
	httpServer: server
});

websocketServer.on("request", websocketRequest);


// websockets storage
global.clients = {}; // connected clients
var connectionId = 0; // incremental unique ID for each connection (this does not decrement on close)

/** 
* This function handles the web socket request send from the client
* No response sent back
* Only accepts the connection
*/
function websocketRequest(request) {

	// TODO: Validate Hostname in Production Mode
	// TIP: You can also get query params and do different setups 

	// start the connection
	var connection = request.accept(null, request.origin); 

	connectionId++;

	// save the connection for future reference
	clients[connectionId] = connection;

}

/**
 * Sends a message to all the clients
 * @param {string} message   	The message to send
 */
function messageClients(message) {

	for (var i in clients) {
		clients[i].sendUTF(message);
	}

}
