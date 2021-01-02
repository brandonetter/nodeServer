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
const {
    SSL_OP_SSLEAY_080_CLIENT_DH_BUG
} = require('constants');
const {
    Socket
} = require('dgram');
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
        y: 0,
        name: null,
        pin: null,
        gold: 0,
        color: 'EEEEEE',
        loggedIn: false,
        hasBody: false
    }

    //this is sent to the client upon connection
    socket.emit('message', userData[socket.id]);

    //when a client performs an action...
    socket.on('clientAction', function (obj) {
        var roomShared = [];
        var clientsRoom = userData[obj.id].room;

        for (const [key, value] of Object.entries(userData)) {

            if (obj.id != key) {
                if (value.room == clientsRoom) {
                    roomShared.push(key);
                    //console.log(`   ${key} is also in room`);
                }
            }
        }
        for (i = 0; i < roomShared.length; i++) {
            if (obj.action == "click") {
                if (!userData[obj.id].hasBody) {
                    io.to(roomShared[i]).emit('server-spawnFren', {
                        userName: obj.userName,
                        x: obj.x,
                        y: obj.y
                    });
                }
            }
            if (obj.action == "move") {
                io.to(roomShared[i]).emit('server-playerMove', {
                    userName: obj.userName,
                    x: obj.x,
                    y: obj.y
                });

            }
            if (obj.action == "input") {
                console.log(obj.input);
                var keys = JSON.parse(obj.input);
                if (keys.W) {
                    userData[obj.id].y -= 2;
                }
                if (keys.A) {
                    userData[obj.id].x -= 2;
                }

                if (keys.S) {
                    userData[obj.id].y += 2;
                }

                if (keys.D) {
                    userData[obj.id].x += 2;
                }

                obj.x = userData[obj.id].x;
                obj.x = userData[obj.id].y;



                io.to(roomShared[i]).emit('server-playerMove', {
                    userName: userData[obj.id].name,
                    x: userData[obj.id].x,
                    y: userData[obj.id].y
                });
                io.to(socket.id).emit('server-playerMove', {
                    userName: userData[obj.id].name,
                    x: userData[obj.id].x,
                    y: userData[obj.id].y
                });

            }

        }
        if (obj.action == "click") {
            if (!userData[obj.id].hasBody) {
                userData[obj.id].hasBody = true;
                userData[obj.id].x = obj.x;
                userData[obj.id].y = obj.y;
                io.to(socket.id).emit('server-spawnFren', {
                    userName: obj.userName,
                    x: obj.x,
                    y: obj.y
                });
            }

        }
        userData[obj.id].lastAction = Date.now();

        //sending to all clients except sender
        //socket.broadcast.emit("message", "It wasn't you!");

    });

    socket.on('getUserInfo', function (obj) {
        var roomShared = [];
        var clientsRoom = userData[obj.id].room;
        var sharedUser = false;
        for (const [key, value] of Object.entries(userData)) {

            if (obj.userName == value.name) {
                if (obj.pin != value.pin) {
                    sharedUser = true;

                    obj.response = "USERNAME EXISTS ALREADY! BAD BOY";
                } else {
                    delete userData[key];
                }
            }
        }
        if (!sharedUser) {
            userData[obj.id].name = obj.userName;
            userData[obj.id].pin = obj.pin;
            userData[obj.id].lastAction = Date.now();
            userData[obj.id].color = Math.floor(13000000 + Math.random() * 3777215).toString(16);
            userData[obj.id].loggedIn = true;
            obj = userData[obj.id];
            obj.good = true;
            obj.response = `YOU'VE CONNECTED TO ${obj.room} AS ${obj.name}`;
        }


        io.to(socket.id).emit('userInfo', obj);

    });


    //Just a debug server Command
    //probably wanna remove this in
    //production
    socket.on('listUsers', function (obj) {
        console.log("======--   USER LIST START   --======");
        for (const [key, value] of Object.entries(userData)) {
            console.log(`   ` + value.name + " ::: " + key);
            console.log(`       ${value.x},${value.y}`);
            console.log(`       color: ${value.color}`);
            console.log(`       room : ${value.room}`);
            if (value.loggedIn) {
                console.log(`       LOGGED IN`);
            }




            var millis = Date.now() - value.lastAction;

            console.log(`           idle time = ${Math.floor(millis / 1000)}`);

        }
        console.log("======--   -=-=-=-=-=-=-=-=-   --======");



    });
    socket.on('joinRoom', function (obj) {
        if (userData[obj.id].room == "landing") {
            userData[obj.id].room = "room" + Math.floor(Math.random() * 5);
            console.log(obj.id + " joined room " + userData[obj.id].room);
            io.emit('server-joinRoom', userData[obj.id]);

        }


    });

    socket.on('userMove', function (obj) {
        console.log(obj.x)


    });


});





//listen to the port 3000
http.listen(3000, function () {
    console.log('listening on *:3000');
});