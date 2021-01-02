var canvas = this.__canvas = new fabric.Canvas('c');
canvas.setDimensions({
    height: 600,
    width: 800
});
canvas.backgroundColor = "#EEFFEE";
// create a rectangle object
var userBlocks = [];
var canlog = false;
setInterval(function () {
    canlog = !canlog;
    canvas.requestRenderAll();
    loop();
}, 30);

function loop() {


    if (keys['W'] || keys['S'] || keys['A'] || keys['D']) {
        sketchSendUserInput();
        userBlocks.forEach(e => {
            //console.log(e.user);
            if (e.user == userID)
                e.top -= 0;
        });
    }

}
var keys = [];


function keyDown(e, t) {
    var x = e.which || e.keyCode;
    x = String.fromCharCode(x);
    keys[x] = t;
    //console.log(x + ":" + keys[x]);
}

function fabricGameDraw(x, y, id) {
    //console.log(id+" "+x+" "+y);
    userBlocks[id] = new fabric.Rect({
        left: x,
        top: y,
        fill: '#D81B60',
        width: 25,
        height: 25,
        strokeWidth: 2,
        stroke: "#880E4F",
        hasControls: false,
        user: id

    });
    userBlocks.push(userBlocks[id]);
    canvas.add(userBlocks[id]);
}

function fabricGameUpdatePos(obj) {
    //console.log(obj.userName);
    // console.log(obj.x +" "+obj.y);

    if (obj.userName) {
        if (userBlocks[obj.userName]) {

            userBlocks[obj.userName].animate('left', obj.x, {
                duration: 30,
                onChange: canvas.renderAll.bind(canvas)
            });

            userBlocks[obj.userName].animate('top', obj.y, {
                duration: 30,
                onChange: canvas.renderAll.bind(canvas)
            });


        }
    }
    // userBlocks.push(userBlocks[id]);
    // canvas.add(userBlocks[id]);
}

canvas.on('mouse:down', function (options) {
    if (socket.id) {
        sketchSendMove(options.pointer);
    }
});