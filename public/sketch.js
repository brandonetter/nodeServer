//create a socket connection
var socket;

function listUsers() {
    socket.emit('listUsers');
}

function joinRoom() {
    socket.emit('joinRoom', {
        id: socket.id
    });
}

function setup() {


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
    socket.on('userInfo', gotUserInfo);
    socket.on('server-playerMove', serverPlayerMove);
    socket.on('server-spawnFren', serverSpawnFren);
    
    if (!socket.id)
        socket.open();
}


function logger(note) {
    document.getElementById('log').innerHTML += "<br>" + note;
}

//p5 function called on mouse press - send coordinates to server
function mousePressed() {
    //make sure the connection is established
    if (socket.id) {

        //send 
        socket.emit('clientAction', {
            x: mouseX,
            y: mouseY,
            id: socket.id,
            action: 'click'

        });

    }
}

function sketchSendUserInput() {
    if (socket.id) {

        keysOut = '{"icu":1,';
        Object.entries(keys).forEach(entry => {
            const [key, value] = entry;
            if(key=='W' ||key=='S'||key=='A'||key=='D')
            keysOut += `"${key}":${value},`;
            //console.log(key + ": " + keysOut['key']);
        });
        keysOut = keysOut.slice(0, -1);
        keysOut += "}";
        socket.emit('clientAction', {
            id: socket.id,
            input: keysOut,
            action: 'input'

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

function serverPlayerMove(obj) {
    fabricGameUpdatePos(obj);
    //fabricGameDraw(obj.x, obj.y, obj.userName);
}
function serverSpawnFren(obj) {
    console.log(obj.x);
    fabricGameDraw(obj.x, obj.y, obj.userName);
}

//connected to the server
function onConnect() {
    if (socket.id && false) {
        userID = document.getElementById('username').value;
        userPin = document.getElementById('pin').value;

        userColor = Math.floor(13000000 + Math.random() * 3777215).toString(16);
        document.getElementById('userColor').style.backgroundColor = '#' + userColor;
        document.getElementById('userColor').innerHTML = userID;
        logger("Connected " + socket.id);


        getUserInfo();

    }

}

function login() {
    if (socket.id) {
        userID = document.getElementById('username').value;
        userPin = document.getElementById('pin').value;

        userColor = Math.floor(13000000 + Math.random() * 3777215).toString(16);
        document.getElementById('userColor').style.backgroundColor = '#' + userColor;
        document.getElementById('userColor').innerHTML = userID;
        logger("Connected " + socket.id);


        getUserInfo();

    }
}

function getUserInfo() {
    if (socket.id) {

        socket.emit('getUserInfo', {
            id: socket.id,
            userName: userID,
            pin: userPin
        });

    }
}

function gotUserInfo(obj) {
    logger(obj.response);
    if (socket.id && obj.good) {
        //ogger(obj.response);
        x = obj.x;
        y = obj.y;
        color = obj.color;
        room = obj.room;
        document.getElementById('loginForm').hidden = true;
        document.getElementById('controls').hidden = false;
    }
}

function joinedRoom(obj) {
    if (socket.id) {

        //logger(socket.id + " Connected to " + obj.room)
    }
}

function sketchSendMove(obj) {
    if (socket.id) {
        socket.emit('clientAction', {
            id: socket.id,
            userName: userID,
            pin: userPin,
            x: obj.x,
            y: obj.y,
            action: "click"
        });
    }

}

//a message from the server
function onMessage(msg) {
    if (socket.id) {
        //logger(msg);

    }
}