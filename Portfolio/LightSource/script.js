(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

window.addEventListener("gamepadconnected", function(e) {
  var gp = navigator.getGamepads()[e.gamepad.index];
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
   e.gamepad.index, e.gamepad.id,
   e.gamepad.buttons.length, e.gamepad.axes.length);
   // gamepadInfo.innerHTML = "Gamepad connected at index " + gp.index + ": " + gp.id + ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes.";
});

window.addEventListener("gamepaddisconnected", function(e) {
  gamepadInfo.innerHTML = "Waiting for gamepad.";

  cancelRequestAnimationFrame(start);
});

function buttonPressed(b) {
  if (typeof(b) == "object") {
    return b.pressed;
  }
  return b == 1.0;
}

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 1000,
    height = 400,
    player = {
        x: width / 2,
        y: 200,
        width: 25,
        height: 25,
        speed: 3,
        velX: 0,
        velY: 0,
        jumping: false,
        grounded: false,
        color:'Black'
    },
    keys = [],
    friction = 0.8,
    gravity = 0.4,
    boxes = [];

boxes.push({//box on left
    x: 0,
    y: height/600,
    width: 10,
    height: height,
});

boxes.push({//ground
    x: 0,
    y: height - 10,
    width: width,
    height: 50,
});
boxes.push({//box on right
    x: width - 10,
    y: 0,
    width: 50,
    height: height,
});
boxes.push({
    x: 290,
    y: 200,
    width: 260,
    height: 10,
});
boxes.push({
    x: 590,
    y: 200,
    width: 80,
    height: 10,
});
boxes.push({
    x: 120,
    y: 250,
    width: 150,
    height: 10,
});
boxes.push({
    x: 220,
    y: 300,
    width: 80,
    height: 10,
});
boxes.push({
    x: 340,
    y: 350,
    width: 90,
    height: 10,
});
boxes.push({
    x: 740,
    y: 300,
    width: 160,
    height: 10,
});

boxes.push({//All platform colors
    x: 90,
    y: 350,
    width: 10,
    height: 50,

});

canvas.width = width;
canvas.height = height;

function update() {

  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  var gp = gamepads[0];
    // check keys
    if (gp != null && buttonPressed(gp.buttons[1])) {
        // up arrow or space
        if (!player.jumping && player.grounded) {
            player.jumping = true;
            player.grounded = false;
            player.velY = -player.speed * 2.5;//how high to jump
        }
    }
    if (gp != null && buttonPressed(gp.buttons[2])) {
        // right arrow
        if (player.velX < player.speed) {
            player.velX++;
        }
    }
    if (gp != null && buttonPressed(gp.buttons[0])) {
        // left arrow
        if (player.velX > -player.speed) {
            player.velX--;
        }
    }

    player.velX *= friction;
    player.velY += gravity;

      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();

    player.grounded = false;
    ctx.fillStyle = "white";
        drawlightsource();

            ctx.beginPath();
            ctx.fillStyle = "Black";

    for (var i = 0; i < boxes.length; i++) {//print boxes
        //ctx.fillStyle = boxes[i].color;
        ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

        var dir = colCheck(player, boxes[i]);

        if (dir === "l" || dir === "r") {
            player.velX = 0;
            player.jumping = false;
        } else if (dir === "b") {
            player.grounded = true;
            player.jumping = false;
        } else if (dir === "t") {
            player.velY *= -1;
        }

    }



    if(player.grounded){
         player.velY = 0;
    }

    player.x += player.velX;
    player.y += player.velY;

    ctx.fill();//Draw charater stuff
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
}

function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
}
function drawlightsource(){
  if (meter == null) return;
  let x = player.x;
  let y = player.y;

  let lightball = new Point(x+player.width/2,y+player.height/2,meter.volume * 800,"white");
  lightball.draw(ctx);

  return lightball;
}
window.addEventListener("load", function () {
    update();
});
