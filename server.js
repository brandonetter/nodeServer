/*
Note the differences between different messages

//sending to sender-client only
socket.emit('message', "this is a test");

//sending to all clients, including sender
io.emit('message', "this is a test");

//sending to all clients except sender
socket.broadcast.emit('message', "this is a test");

*/

//create a web application that uses the express frameworks and socket.io to communicate via http (the web protocol)
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var users = [];
var userData = [];
//when a client connects serve the static files in the public directory ie public/index.html
app.use(express.static('public'));

//when a client connects 
io.on('connection', function (socket) {
    //this appears in the terminal
    console.log('A user connected ->' + socket.id);
    users.push(socket.id);
    userData[socket.id] = {
        lastAction: Date.now(),
        room: 'landing',
        x: 0,
        y: 0
    }

    //this is sent to the client upon connection
    socket.emit('message', userData[socket.id]);

    //when a client performs an action...
    socket.on('clientAction', function (obj) {
        userData[obj.id].lastAction = Date.now();
        console.log(obj.id + ":" + userData[obj.id].room);
        //I log it on the console
        console.log("   pressed at " + obj.x + "," + obj.y);

        //and send it to all clients
        io.emit('action', obj);

        //sending to all clients except sender
        socket.broadcast.emit("message", "It wasn't you!");

    });

    socket.on('listUsers', function (obj) {
        for (i = 0; i < users.length; i++) {
            console.log(users[i] + ": ");
            //var json = JSON.parse(userData[users[i]]);
            console.log(userData[users[i]]);

            var millis = Date.now() - userData[users[i]].lastAction;

            console.log(`idle time = ${Math.floor(millis / 1000)}`);

        }



    });
    socket.on('joinRoom', function (obj) {
        if (userData[obj.id].room == "landing") {
            userData[obj.id].room = "room" + Math.floor(Math.random() * 5);
            console.log(obj.id + " joined room " + userData[obj.id].room);
            io.emit('server-joinRoom', userData[obj.id]);

        }


    });


});





//listen to the port 3000
http.listen(3000, function () {
    console.log('listening on *:3000');
});
