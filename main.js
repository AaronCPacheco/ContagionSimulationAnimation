var canvas,width,height,ctx,circles;

init();

function init(){
    console.log('init');
    canvas = document.querySelector('.myCanvas');
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    //ctx.fillStyle = 'rgb(0,0,0)';
    //ctx.fillRect(0, 0, width, height);
    circles = [];

    for(var i = 0; i < 100; i++){
        var circle = {};
        circle.infected = false;
        circle.radius = 3;
        circle.x = Math.floor(Math.random() * width);
        circle.y = Math.floor(Math.random() * height);
        //circle.r = Math.floor(Math.random() * 255);
        //circle.g = Math.floor(Math.random() * 255);
        //circle.b = Math.floor(Math.random() * 255);
        circle.vector = {};
        circle.vector.x = (Math.random() - 0.5)/2;
        circle.vector.y = (Math.random() - 0.5)/2;
        circles.push(circle);
    }

    circles[0].infected = true;

    console.log(circles);
}

function update(progress){
    for(circ in circles){
        circles[circ].x += circles[circ].vector.x * progress;
        circles[circ].y += circles[circ].vector.y * progress;
        if(circles[circ].x + circles[circ].radius >= width || circles[circ].x - circles[circ].radius <= 0){
            circles[circ].vector.x *= -1;
            circles[circ].x += circles[circ].vector.x * progress;
        }
        if(circles[circ].y + circles[circ].radius >= height || circles[circ].y - circles[circ].radius <= 0){
            circles[circ].vector.y *= -1;
            circles[circ].y += circles[circ].vector.y * progress;
        }
    }

    for(var i = 0; i < circles.length; i++){
        for(var j = circles.length-1; j > i; j--){
            if(isCollision(circles[i],circles[j])){
                ix = circles[j].vector.x;
                iy = circles[j].vector.y;
                jx = circles[i].vector.x;
                jy = circles[i].vector.y;
                circles[i].vector.x = ix;
                circles[i].vector.y = iy;
                circles[j].vector.x = jx;
                circles[j].vector.y = jy;
                circles[i].x += circles[i].vector.x * progress;
                circles[i].y += circles[i].vector.y * progress;
                circles[j].x += circles[j].vector.x * progress;
                circles[j].y += circles[j].vector.y * progress;
                if(circles[i].infected || circles[j].infected){
                    circles[i].infected = true;
                    circles[j].infected = true;
                }
            }
        }
    }
}

function isCollision(circle1, circle2){
    var dx = circle1.x - circle2.x;
    var dy = circle1.y - circle2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < circle1.radius + circle2.radius) {
        return true;
    } else {
        return false;
    }
}

function draw(){
    console.log('draw');
    ctx.clearRect(0, 0, width, height);
    for(circ in circles){
        console.log(circles[circ]);
        drawCircle(circles[circ].x,circles[circ].y,circles[circ].radius,circles[circ].infected);
    }
}

function loop(timestamp){
    console.log('mainLoop');
    var progress = timestamp - lastRender;       
    update(progress);
    draw();
    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}

function drawCircle(x,y,radius,infected){
    if(infected){
        ctx.fillStyle = 'rgb(255,0,0)';
    }else{
        ctx.fillStyle = 'rgb(255,255,255)';
    }
    ctx.beginPath();
    ctx.arc(x, y, radius, degToRad(0), degToRad(360), false);
    ctx.fill();
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
};

var lastRender = 0;
window.requestAnimationFrame(loop);