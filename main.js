function runSimulation(){
    var distancing = document.getElementById("distancing").value;
    var density = document.getElementById("density").value;
    var dotSize = document.getElementById("dotsize").value;
    window.location = ("/ContagionSimulationAnimation/simulation.html?distancing=" + distancing
        + "&density=" + density + "&dotsize=" + dotSize);
}
function onChangeDensity(){
    var density = document.getElementById("density").value;
    var densityOut = document.getElementById("densityout");
    densityOut.innerHTML = density+"%";
}
function onChangeDotSize(){
    var dotSize = document.getElementById("dotsize").value;
    var dotSizeOut = document.getElementById("dotsizeout");
    dotSizeOut.innerHTML = dotSize;
}
function start(){
    var canvas,width,height,ctx,circles,lockedCircles;
    
    init();
    
    function init(){
        var queryString = window.location.search;
        var urlParams = new URLSearchParams(queryString);
        var distancing = urlParams.get('distancing');
        var density = urlParams.get('density');
        var dotSize = Number(urlParams.get('dotsize'));
        canvas = document.querySelector('.myCanvas');
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        var denominator = Math.floor(15000/(density*.01));
        numberBalls = Math.floor((width*height)/denominator);
        movingBalls = Math.floor(numberBalls*((100-distancing)*.01));
        stillBalls = numberBalls - movingBalls;
        ctx = canvas.getContext('2d');
        //ctx.fillStyle = 'rgb(0,0,0)';
        //ctx.fillRect(0, 0, width, height);
        circles = [];

        for(var i = 0; i < movingBalls; i++){
            var circle = {};
            circle.infected = false;
            circle.infectedTimestamp;
            circle.immune = false;
            circle.radius = dotSize;
            circle.x = Math.floor(Math.random() * width);
            circle.y = Math.floor(Math.random() * height);
            circle.vector = {};
            circle.vector.x = (Math.random() - 0.5)/2;
            circle.vector.y = (Math.random() - 0.5)/2;
            circles.push(circle);
        }

        for(var i = 0; i < stillBalls; i++){
            var circle = {};
            circle.infected = false;
            circle.infectedTimestamp;
            circle.immune = false;
            circle.radius = dotSize;
            circle.x = Math.floor(Math.random() * width);
            circle.y = Math.floor(Math.random() * height);
            circle.vector = {};
            circle.vector.x = 0;
            circle.vector.y = 0;
            circles.push(circle);
        }

        circles[0].infected = true;
    }

    function update(progress,timestamp){
        if(!circles[0].infectedTimestamp){
            circles[0].infectedTimestamp = timestamp;
        }
        
        for(circ in circles){
            if(timestamp - circles[circ].infectedTimestamp > 10000){
                circles[circ].infected = false;
                circles[circ].immune = true;
            }
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
                        if(!circles[i].immune && !circles[i].infected){
                            circles[i].infected = true;
                            circles[i].infectedTimestamp = timestamp;
                        } 
                        if(!circles[j].immune && !circles[j].infected){
                            circles[j].infected = true;
                            circles[j].infectedTimestamp = timestamp;
                        }
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
        ctx.clearRect(0, 0, width, height);
        for(circ in circles){
            drawCircle(circles[circ].x,circles[circ].y,circles[circ].radius,circles[circ].infected,circles[circ].immune);
        }
    }

    function loop(timestamp){
        var progress = timestamp - lastRender;       
        update(progress,timestamp);
        draw();
        lastRender = timestamp;
        window.requestAnimationFrame(loop);
    }

    function drawCircle(x,y,radius,infected,immune){
        if(immune){
            ctx.fillStyle = 'rgb(0,0,255)';
        }else if(infected){
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
}