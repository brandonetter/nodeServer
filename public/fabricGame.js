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
}, 280);

function loop(){
    sketchSendUserInput(keys);
    
    if(keys['W']){
        
        userBlocks.forEach(e=>{
            console.log(e.user);
            if(e.user == userID)
            e.top-=4;
        });
    }
}
var keys = [];


function keyDown(e,t){
    var x = e.which || e.keyCode;
    x = String.fromCharCode(x);
    keys[x]=t;
    console.log(x+":"+keys[x]);
}
function fabricGameDraw(x,y,id){
    
    var rect = new fabric.Rect({
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
    userBlocks.push(rect);
    canvas.add(rect);
}
canvas.on('mouse:down', function (options) {
    if(socket.id){
        sketchSendMove(options.pointer);
    }
});