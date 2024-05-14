// HelloPoint1.js (c) 2012 matsuda

// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_WhichTexture;
  void main() {
    vec4 wallTexture = texture2D(u_Sampler0, v_UV);
    vec4 bush = texture2D(u_Sampler1, v_UV);
    vec4 grassTexture = texture2D(u_Sampler2, v_UV);
    if (u_WhichTexture == -2) {
      gl_FragColor = u_FragColor;
    } else if (u_WhichTexture == -1) {
      gl_FragColor = vec4(v_UV,1.0,1.0);
    } else if (u_WhichTexture == 0) {
      //gl_FragColor = 0.5 * bodyTexture + 0.5 * u_FragColor;
      gl_FragColor = wallTexture;
    } else if (u_WhichTexture == 1) {
      gl_FragColor = bush;
    } else if (u_WhichTexture == 2) {
      gl_FragColor = grassTexture;
    } else {
      gl_FragColor = vec4(1,.2,.2,1);
    }
  }`

// Global Vars
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_WhichTexture;
let u_ModelMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;

// global UI elements
let g_startTime = performance.now()/1000.0;
let g_seconds = performance.now()/1000.0-g_startTime;
let g_animation = false;
let g_poke = false;
let g_pokeStart = 0;

// global animation angles
let g_frontLegAngle = 0;
let g_backLegAngle = 0;
let g_frontKneeAngle = 0;
let g_backKneeAngle = 0;
let g_frontHoofAngle = 0;
let g_bodyAngle = 0;
let g_tailAngle = 70;
let g_bodyY = 0;

// camera
let g_camera;

// map
let g_map = new Map();
g_map.generateMap();

// Sets up WebGL
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", {preserveDrawingBuffer:true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

// Connects js vars to GLSL vars in shaders
function connectVarsToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  // Get the storage location of u_Sampler1
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  // Get the storage location of u_sampler2
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }

  // Get the storage location of u_WhichTexture
  u_WhichTexture = gl.getUniformLocation(gl.program, 'u_WhichTexture');
  if (!u_WhichTexture) {
    console.log('Failed to get the storage location of u_WhichTexture');
    return false;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  return;
}

function initTextures() {
  // create image object
  var image = new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }

  var image2 = new Image();
  if (!image2) {
    console.log('Failed to create the image object');
    return false;
  }

  var image3 = new Image();
  if(!image3) {
    console.log('Failed to create the image object');
    return false;
  }

  // register the event handler to be called on loading an image
  image.onload = function() { sendImageToTEXTURE0(image);};
  // tell the browser to load an image
  image.src = 'wall.jpg';

  image2.onload = function() { sendImageToTEXTURE1(image2);};
  image2.src = 'bush.jpg';

  image3.onload = function() { sendImageToTEXTURE2(image3); };
  image3.src = 'grass.jpg';
  return true;
}

function sendImageToTEXTURE0(image) {
  // create texture object
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create a texture object');
    return false;
  }

  // flip image y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // bind the texture obj to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // set the texture params
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler0, 0);

  // console.log('finished loadTexture');
}

function sendImageToTEXTURE1(image) {
  // create texture object
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create a texture object');
    return false;
  }

  // flip image y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  // Enable texture unit1
  gl.activeTexture(gl.TEXTURE1);
  // bind the texture obj to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // set the texture params
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler1, 1);

  //console.log('finished loadTexture');
}

function sendImageToTEXTURE2(image) {
  // create texture object
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create a texture object');
    return false;
  }

  // flip image y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  // Enable texture unit1
  gl.activeTexture(gl.TEXTURE2);
  // bind the texture obj to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // set the texture params
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler2, 2);

  console.log('finished loadTexture');
}

// Extract mouse coords and return WebGL coords
function convertCoordinatesEventToGL(ev) {

  var x = ev.clientX; // Get mouse x position
  var y = ev.clientY; // Get mouse y position
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2) / (canvas.width / 2);
  y = (canvas.height/2 - (y - rect.top)) / (canvas.height / 2);

  return [x, y];
}

function addActionsForHtmlUI() {
  // Animation Buttons
  document.getElementById('UpMap').onclick = function() {g_camera.eye = new Vector3([0, 34, 0]); g_camera.at = new Vector3([0, 33, -.001]); g_camera.updateCamera();}
  document.getElementById('DownMap').onclick = function() {g_camera.eye = new Vector3([0,.3,0+20]); g_camera.at = new Vector3([0,.3,-1+20]); g_camera.updateCamera();}

  document.getElementById('NewMap').onclick = function() {g_map.generateMap()}

}

function sendTextToHTML(text) {
  const output = document.getElementById('output');
  output.textContent = text;
}

function UpdateAnimationAngles() {
  if (g_poke) {
    let speed = 2;
    if (g_seconds - g_pokeStart < 3/speed) {

      g_bodyAngle = 117*((g_seconds - g_pokeStart)*1.037*speed);
      g_bodyY = 2*Math.sin((g_seconds -g_pokeStart)*1.047*speed)

      g_frontLegAngle = 40*Math.sin((g_seconds - g_pokeStart)*1.05*speed);
      g_backLegAngle = -40*Math.sin((g_seconds - g_pokeStart)*1.05*speed);

      g_tailAngle = -90*Math.sin((g_seconds - g_pokeStart) * 1.05 * speed) + 70;

    } else {
      g_bodyAngle = 0;
      g_bodyY = 0;
      g_tailAngle = 70;
      g_poke = false;
    }
    return;
  }

  speed = 5;
  dAng_dTime = g_frontLegAngle;
  if (g_animation) {
    g_bodyAngle = 7*Math.sin(g_seconds * speed);
    g_tailAngle = -1.5*g_bodyAngle + 70;
    g_frontLegAngle = 30*Math.sin(g_seconds * speed);
    g_backLegAngle = -g_frontLegAngle - 10;
    dAng_dTime = dAng_dTime - g_frontLegAngle;

    if (dAng_dTime >= 0) {
      if (g_frontLegAngle > 1) {
        g_frontKneeAngle = -2*g_frontLegAngle;
      } else if (g_frontLegAngle < 1 && g_frontLegAngle > -1) {
        g_frontKneeAngle = 0;
      } else {
        g_frontKneeAngle = 2*g_frontLegAngle;
      }
    } else {
      g_frontKneeAngle = -60;
    }

    if (dAng_dTime <= 0) {
      if (g_frontLegAngle > 1) {
        g_backKneeAngle = -2*g_frontLegAngle;
      } else if (g_frontLegAngle < 1 && g_frontLegAngle > -1) {
        g_backKneeAngle = 0;
      } else {
        g_backKneeAngle = 2*g_frontLegAngle;
      }
    } else {
      g_backKneeAngle = -60;
    }

  }
}

function UpdateCameraPosition() {
  if (g_keysDown[87]) {
    g_camera.moveForward();
  }
  
  if (g_keysDown[65]) {
    g_camera.moveLeft();
  }

  if (g_keysDown[83]) {
    g_camera.moveBackward();
  }

  if (g_keysDown[68]) {
    g_camera.moveRight();
  }

  if (g_keysDown[81]) {
    g_camera.panLeft();
  }

  if (g_keysDown[69]) {
    g_camera.panRight();
  }
}

// Render all shapes defined by buffers onto canvas
function renderAllShapes() {
  // check time for performance check
  var start = performance.now();

  // pass projection matrix
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projMat.elements);
  // pass view matrix
  gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMat.elements);

  // Clear Canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // colors
  let groundColor = [.3, .7, .3, 1];
  let skyColor = [.53, .81, 1, 1];

  // sky
  var skyM = new Matrix4();
  skyM.scale(100, 100, 100);
  skyM.translate(-.5, -.5, -.5);
  var sky = new Cube(skyM, skyColor);
  sky.render();

  // ground
  var groundM = new Matrix4();
  groundM.translate(-25, -.65, -25);
  groundM.scale(50, .001, 50);
  var ground = new Cube(groundM, groundColor, 2);
  ground.render();

  // walls
  g_map.drawMap();

  // performance check
  var duration = performance.now() - start;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration));
}

// registers mouse click and pushes inputed values to buffers
function handleOnClick(ev) {
  if (ev.buttons != 1) {
    return;
  }

  if (g_keysDown[16]) {
    g_map.placeBlock();
    g_pokeStart = g_seconds;
    g_bodyAngle = 0;
    g_backLegAngle = 0;
    g_frontLegAngle = 0;
    g_backKneeAngle = 0;
    g_frontKneeAngle = 0;
    g_tailAngle = 70;
    g_poke = true;
    g_animation = false;
  } 

  if (ev.buttons == 1 && !g_keysDown[16]) {
    g_map.breakBlock();
  }
  
  let [x, y] = convertCoordinatesEventToGL(ev);

  //g_globalXAngle = x*90;
  //g_globalYAngle = y*90;

  renderAllShapes();
}

// keep track of currently down  keys
let g_keysDown = {}

// handles when a keyboard key is pressed
function handleOnKeyDown(ev) {
  // store keys pressed
  g_keysDown[ev.keyCode] = true;
}

// handles if a keyboard key is unpressed
function handleOnKeyUp(ev) {
  g_keysDown[ev.keyCode] = false;
}

function tick() {
  g_seconds = performance.now()/1000.0-g_startTime;

  UpdateAnimationAngles();

  UpdateCameraPosition();

  renderAllShapes();

  requestAnimationFrame(tick);
}

function main() {

  setupWebGL();
  connectVarsToGLSL();
  addActionsForHtmlUI();
  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // camera
  g_camera = new Camera();

  canvas.onmousedown = handleOnClick;
  canvas.onmousemove = handleOnClick;
  canvas.onmousemove = g_camera.onMove;
  document.addEventListener('keydown', handleOnKeyDown);
  document.addEventListener('keyup', handleOnKeyUp);

  requestAnimationFrame(tick);
}