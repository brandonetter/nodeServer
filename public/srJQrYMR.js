fabric.Object.prototype.noScaleCache = false;

var objArray = [];
/*
	strokeUniform works better without scalingCache
	Objects in group are not scaled directly, so stroke uniform will not have effect.
*/
function toggleUniform() {
    var aObject = canvas.getActiveObject();
    if (aObject.type === 'activeSelection') {
        aObject.getObjects().forEach(function (obj) {
            obj.set('strokeUniform', !obj.strokeUniform);
        });
    } else {
        aObject.set('strokeUniform', !aObject.strokeUniform);
    }
    canvas.requestRenderAll();
}

var canvas = this.__canvas = new fabric.Canvas('c');
canvas.setDimensions({
    height: 600,
    width: 800
});
canvas.backgroundColor = "#EEFFEE";
// create a rectangle object
var rect = new fabric.Rect({
    left: 100,
    top: 50,
    fill: '#D81B60',
    width: 50,
    height: 50,
    strokeWidth: 2,
    stroke: "#880E4F",
    rx: 10,
    ry: 10,
    angle: 45,
    scaleX: 3,
    scaleY: 3,
    hasControls: true,

});
var canlog = false;
setInterval(function () {
    canlog = !canlog;
    canvas.requestRenderAll();
}, 80);



//canvas.add(rect);

var circle1 = new fabric.Circle({
    radius: 65,
    fill: '#039BE5',
    left: 0,
    stroke: 'red',
    strokeWidth: 3
});

var circle2 = new fabric.Circle({
    radius: 65,
    fill: '#4FC3F7',
    left: 110,
    opacity: 0.7,
    stroke: 'blue',
    strokeWidth: 3,
    strokeUniform: true
});

//canvas.add(circle1);

function addShape(shapeName, radi, color, shape) {
    if (shape == "square") {

        objArray[shapeName] = new fabric.Rect({
            left: 10,
            top: 10,
            fill: '#' + color,
            width: radi,
            height: 50,
            strokeWidth: 2,
            stroke: "FFFFFF",
            hasControls: true,
            strokeUniform: true,
            opacity: 0.7

        });
    }
    if (shape == "circle") {
        objArray[shapeName] = new fabric.Circle({
            radius: radi,
            fill: '#' + color,
            left: 110,
            opacity: 0.7,
            stroke: 'blue',
            strokeWidth: 3,
            strokeUniform: true
        });
    }
    objArray[shapeName].on('moving', function (options) {
        if (canlog) {
            //logger(options.transform.target.left);
            updateLoc(shapeName, options.transform.target.left, options.transform.target.top)
            canlog = false;
        }
    });

    objArray[shapeName].on('modified', function (options) {
        updateLoc(shapeName, options.transform.target.left, options.transform.target.top, userColor)
    });
    objArray[shapeName].on('scaling', function (options) {
        if (canlog) {
            updateScale(shapeName, options.transform.target.scaleX, options.transform.target.scaleY);
            canlog = false;
        }

    });
    objArray[shapeName].on('scaled', function (options) {

        updateScale(shapeName, options.transform.target.scaleX, options.transform.target.scaleY);


    });

    objArray[shapeName].on('rotating', function (options) {
        if (canlog) {
            updateAngle(shapeName, options.transform.target.angle);
            canlog = false;
        }

    });
    objArray[shapeName].on('rotated', function (options) {

        updateAngle(shapeName, options.transform.target.angle);


    });

    canvas.add(objArray[shapeName]);
}


function initializeMulti() {

    objArray['rect'] = rect;
    objArray['circle1'] = circle1;

    circle1.on('moving', function (options) {
        if (canlog) {
            //logger(options.transform.target.left);
            updateLoc('circle1', options.transform.target.left, options.transform.target.top)
            canlog = false;
        }
    });

    circle1.on('modified', function (options) {
        updateLoc('circle1', options.transform.target.left, options.transform.target.top)
    });



    rect.on('moving', function (options) {
        if (canlog) {
            //logger(options.transform.target.left);
            updateLoc('rect', options.transform.target.left, options.transform.target.top)
            canlog = false;
        }
    });

    rect.on('modified', function (options) {
        updateLoc('rect', options.transform.target.left, options.transform.target.top)
    });
}
