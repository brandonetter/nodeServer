//check README.md for more information

/// <reference path="TSDef/p5.global-mode.d.ts" />

//create a socket connection
var socket;

function boop() {
    socket.emit('listUsers');
}

function joinRoom() {
    socket.emit('joinRoom', {
        id: socket.id
    });
}

function setup() {
    //create a canvas
    createCanvas(800, 600);
    //paint it white
    background(255, 255, 255);

    //I create socket but I wait to assign all the functions before opening a connection
    socket = io({
        autoConnect: false
    });

    //detects a server connection 
    socket.on('connect', onConnect);
    //handles the messages from the server, the parameter is a string
    socket.on('message', onMessage);
    //handles the user action broadcast by the server, the parameter is an object
    socket.on('action', onAction);
    socket.on('server-joinRoom', joinedRoom);
    socket.open();
}

//this function is called continuously
function draw() {

}

function logger(note) {
    document.getElementById('log').innerHTML += "<br>" + note;
}

//p5 function called on mouse press - send coordinates to server
function mousePressed() {
    //make sure the connection is established
    if (socket.id) {

        console.log("Mouse pressed at " + mouseX + " " + mouseY);
        //send 
        socket.emit('clientAction', {
            x: mouseX,
            y: mouseY,
            id: socket.id
        });

    }
}

//called by the server upon any user action including me
function onAction(obj) {
    //change fill color to black
    fill(255, 0, 0);
    //draw a circle
    ellipse(obj.x, obj.y, 20, 20);
}

//connected to the server
function onConnect() {
    if (socket.id) {
        console.log("Connected to the server");
        logger("Connecte as " + socket.id)
    }
}

function joinedRoom(obj) {
    if (socket.id) {
        console.log(socket.id + " Connected to " + obj.room);
        logger("Connecte as " + socket.id)
    }
}

//a message from the server
function onMessage(msg) {
    if (socket.id) {
        logger("connected to room: " + msg.room);
        console.log("Message from server: " + msg);
    }
}
