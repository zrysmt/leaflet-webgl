/**
 * a webgl lib based on leaflet 
 * @Ahthor Ruyi　Zhao
 * @Date 2017-06-06
 */
// transform world coordinate by matrix uniform variable
// * mapMatrix 转化为WebGL坐标系
// worldCoord 地理坐标
import L from 'leaflet';

let VSHADER_SOURCE =
    'attribute vec4 worldCoord;\n' +
    'uniform mat4 mapMatrix;\n' +

    'void main() {\n' +
    '  	gl_Position = mapMatrix * worldCoord;\n' +
    '  	gl_PointSize = 10.;\n' +
    '}\n';
let FSHADER_SOURCE =
    'void main() {\n' +
    '  	gl_FragColor = vec4(.1, .8, 0.08, 1.);\n' +
    '}\n';
/*
 * Add a new log message
 */
function addMessage(message, milliseconds) {

    if (milliseconds === undefined) {} else {
        message = message + ' [' + milliseconds.toString() + ' ms]';
    }

    console.log('message', message);

}
var gl;
var pixelsToWebGLMatrix = new Float32Array(16);
var mapMatrix = new Float32Array(16);

var pointProgram;
var pointArrayBuffer;
var POINT_COUNT = 500000;

// Spherical Mercator projection Points Boundary (Thailand)
var MIN_X = 199.15235555555554;
var MAX_X = 199.84768;
var MIN_Y = 117.74998759079017;
var MAX_Y = 118.25784290489942;

var date1;
var date2;
L.TileLayer.WebGL = L.Layer.extend({   //modify Class to Layer

    initialize: function() {
        this.data = [];
    },

    onAdd: function(map) {
        var date1 = new Date().getTime();
        this.map = map;
        var mapsize = map.getSize();
        var options = this.options;

        var c = document.createElement("canvas");
        c.id = 'webgl-leaflet';
        c.width = mapsize.x;
        c.height = mapsize.y;

        c.style.position = 'absolute';

        map.getPanes().overlayPane.appendChild(c);

        // initialize WebGL
        gl = c.getContext('experimental-webgl');

        createShaderProgram();

        loadData();

        this.canvas = c;

        map.on("move", this._plot, this);

        /* hide layer on zoom, because it doesn't animate zoom */
        map.on("zoomstart", this._hide, this);
        map.on("zoomend", this._show, this);
        map.on("resize", this._resize, this);
        this._resize();
        this._plot();
        var date2 = new Date().getTime();
        addMessage(POINT_COUNT + " Points Drawn", date2 - date1);
    },

    onRemove: function(map) {
        map.getPanes().overlayPane.removeChild(this.canvas);
        map.off("move", this._plot, this);
        map.off("zoomstart", this._hide, this);
        map.off("zoomend", this._show, this);
    },

    _hide: function() {
        this.canvas.style.display = 'none';
    },

    _show: function() {
        this.canvas.style.display = 'block';
    },

    _clear: function() {},

    _resizeRequest: undefined,

    _plot: function() {
    	var map = this.map;
        // Set clear color
        gl.clear(gl.COLOR_BUFFER_BIT);

        // copy pixel->webgl matrix
        mapMatrix.set(pixelsToWebGLMatrix);

        // Scale to current zoom (worldCoords * 2^zoom)
        var scale = Math.pow(2, map.getZoom());
        scaleMatrix(mapMatrix, scale, scale);

        //Change canvas top/left according to map bound
        //Canvas is fixed to topleft during scrolling map
        L.DomUtil.setPosition(this.canvas, map.latLngToLayerPoint(map.getBounds().getNorthWest()));

        var offset = latLongToPixelXY(map.getBounds().getNorthWest().lat, map.getBounds().getNorthWest().lng);
        //console.log('offset', offset);
        translateMatrix(mapMatrix, -offset.x, -offset.y);

        var matrixLoc = gl.getUniformLocation(pointProgram, 'mapMatrix');

        gl.uniformMatrix4fv(matrixLoc, false, mapMatrix);

        gl.drawArrays(gl.POINTS, 0, POINT_COUNT);
    },

    _resize: function() {
        //helpful for maps that change sizes
        var mapsize = this.map.getSize();
        this.canvas.width = mapsize.x;
        this.canvas.height = mapsize.y;

        var width = this.canvas.width;
        var height = this.canvas.height;

        gl.viewport(0, 0, width, height);

        // matrix which maps pixel coordinates to WebGL coordinates
        pixelsToWebGLMatrix.set([2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 0, 0, -1, 1, 0, 1
        ]);

    },

    addDataPoint: function(lat, lon) {
        this.data.push([lat, lon]);
    },

    clearData: function() {
        this.data = [];
    },

    update: function() {
        this._plot();
    }
});

L.TileLayer.webgl = function() {
    return new L.TileLayer.WebGL();
};
// linear interpolate between a and b
function lerp(a, b, t) {
    return a + t * (b - a);
}

function loadData() {
    // this data could be loaded from anywhere, but in this case we'll
    // generate some random x,y coords in a world coordinate bounding box
    var rawData = new Float32Array(2 * POINT_COUNT);
    for (var i = 0; i < rawData.length; i += 2) {
        rawData[i] = lerp(MIN_X, MAX_X, Math.random());
        rawData[i + 1] = lerp(MIN_Y, MAX_Y, Math.random());
    }

    pointArrayBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointArrayBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, rawData, gl.STATIC_DRAW);

    // enable the 'worldCoord' attribute in the shader to receive buffer
    var attributeLoc = gl.getAttribLocation(pointProgram, 'worldCoord');
    gl.enableVertexAttribArray(attributeLoc);

    // tell webgl how buffer is laid out (pairs of x,y coords)
    gl.vertexAttribPointer(attributeLoc, 2, gl.FLOAT, false, 0, 0);
}

function createShaderProgram() {
    // create vertex shader
    var vertexSrc = VSHADER_SOURCE;
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSrc);
    gl.compileShader(vertexShader);

    // create fragment shader
    var fragmentSrc = FSHADER_SOURCE;
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSrc);
    gl.compileShader(fragmentShader);

    // link shaders to create our program
    pointProgram = gl.createProgram();
    gl.attachShader(pointProgram, vertexShader);
    gl.attachShader(pointProgram, fragmentShader);
    gl.linkProgram(pointProgram);

    gl.useProgram(pointProgram);
}

function scaleMatrix(matrix, scaleX, scaleY) {
    // scaling x and y, which is just scaling first two columns of matrix
    matrix[0] *= scaleX;
    matrix[1] *= scaleX;
    matrix[2] *= scaleX;
    matrix[3] *= scaleX;

    matrix[4] *= scaleY;
    matrix[5] *= scaleY;
    matrix[6] *= scaleY;
    matrix[7] *= scaleY;
}

function translateMatrix(matrix, tx, ty) {
    // translation is in last column of matrix
    matrix[12] += matrix[0] * tx + matrix[4] * ty;
    matrix[13] += matrix[1] * tx + matrix[5] * ty;
    matrix[14] += matrix[2] * tx + matrix[6] * ty;
    matrix[15] += matrix[3] * tx + matrix[7] * ty;
}

function latLongToPixelXY(latitude, longitude) {
    var pi_180 = Math.PI / 180.0;
    var pi_4 = Math.PI * 4;
    var sinLatitude = Math.sin(latitude * pi_180);
    var pixelY = (0.5 - Math.log((1 + sinLatitude) /
        (1 - sinLatitude)) / (pi_4)) * 256;
    var pixelX = ((longitude + 180) / 360) * 256;

    var pixel = {
        x: pixelX,
        y: pixelY
    };
    return pixel;
}


export default L.TileLayer.WebGL;