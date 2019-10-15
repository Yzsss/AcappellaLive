//http portion
var https = require('https');
var fs = require('fs'); // Using the filesystem module
var url = require('url');

var vid;


var options = {
  key: fs.readFileSync('my-key.pem'),
  cert: fs.readFileSync('my-cert.pem')
};

function handleIt(req, res) {
  var parsedUrl = url.parse(req.url);

  var path = parsedUrl.pathname;
  if (path == "/") {
    path = "index.html";
  }

  fs.readFile(__dirname + path,

    // Callback function for reading
    function(err, fileContents) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + req.url);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200);
      res.end(fileContents);
    }
  );

  // Send a log message to the console
  console.log("Got a request " + req.url);
}

var httpServer = https.createServer(options, handleIt);
httpServer.listen(8080);

console.log('Server listening on port 8080');


// To all clients, on io.sockets instead
// io.sockets.emit('message', "this goes to everyone");

//socket.broadcast.send(data);




// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);


io.sockets.on('connection', 
    // We are given a websocket object in our function
    
	function (socket) {
        console.log("We have a new client: " + socket.id);
        
        //socket.broadcast.send('vid', vid);
	
		// When this user "send" from clientside javascript, we get a "message"
		// client side: socket.send("the message");  or socket.emit('message', "the message");
		
		

        
      socket.on('video', function(vid){
			    console.log(vid);
          
          fs.writeFile(__dirname + '/x.webm', vid, function(err){
				    if (err) console.log(err);
				    console.log("It's saved!")
            });
            

		  });
        
        

		socket.on('disconnect', function() {
			console.log("Client has disconnected");
        });

        
	}
);