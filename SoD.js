let m = true;
let r = document.getElementById("restart");

let c = document.getElementById("container");
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let width;
let height;

let end_time = Date.now();  // for music

canvas.addEventListener("click", thing);

// SCALE TO SCREEN SIZE  1536 * 763
function scale() {
    height = window.innerHeight / 1.18;  // 1.18
    width = height * 1.6;  // 1.6
    
    // if (width < 1024) {
    //     width = window.innerWidth - 10;
    //     height = width / 1.6;
    // }
    
    canvas.setAttribute("height", height);
    canvas.setAttribute("width", width);

}

scale();

function thing() {
    if (end_time < Date.now()) {

        let r = Math.floor(Math.random() * 3);
        let music = new Audio(["thing.mp3", "Canon in D (128 kbps).mp3", "Serenade (128 kbps).mp3"][r]);

        if (m) {        
            music.play();
            music.loop = false;
        }
        m = false;

        let duration;
        music.addEventListener("loadeddata", function() {duration = music.duration});
        end_time = Date.now() + duration;
    }
}

function start() {
    context.fillStyle = "white";
    context.font = `${height/13}px comic-sans`;
    context.fillText("☠️Squares of Doom☠️", width/3, height/2);
    context.font = `${height/26}px comic-sans`;
    context.fillText("Click to begin... ", width*4/8, height*4/7);
    canvas.addEventListener("click", play);
}

function play() {
    const SECRET_CODE = [0];

    canvas.removeEventListener("click", play);

    document.body.addEventListener("keydown", key_down);
    document.body.addEventListener("keyup", key_up);
    
    // ===============================  MOVE  ==========================================
    let up = false;
    let down = false;
    let right = false;
    let left = false;

    let Meniscus = 0;
    let Shave = 0;
    let meniscus = [77, 69, 78, 73, 83, 67, 85, 83]
    let shave = [83, 72, 65, 86, 69]
    
    function key_down(e) {
        var key_code = e.which || e.keyCode;
        SECRET_CODE.push(key_code);
        if (SECRET_CODE.length > 20) {
            SECRET_CODE.splice(0, 1);
        }
        if (SECRET_CODE.slice(-8).every((val, index) => val === meniscus[index])) {
            Meniscus += 1;
        }
        if (SECRET_CODE.slice(-5).every((val, index) => val === shave[index])) {
            Shave += 1;
        }
        

        // console.log(SECRET_CODE);
        switch (key_code) {
            case 37:    
            case 65: 
                left = true; 
                break;
            case 38:
            case 76: 
                up = true; 
                break;
            case 39: 
            case 68: 
                right = true; 
                break;
            case 40: 
            case 83: 
                down = true; 
                break;
            case 80:
                console.log('pressing');
                pause = pause == true ? false : true;
            }
        }
    function key_up(e) {
        var key_code = e.which || e.keyCode;
        switch (key_code) {
            case 37: 
            case 65: 
                left = false;
                break;
            case 38: 
            case 76: 
                up = false; 
                break;
            case 39: 
            case 68: 
                right = false; 
                break;
            case 40: 
            case 83: 
                down = false; 
                break;
            }
        }
    
    // ================================================================================  
    
    function random(x) {
        return Math.floor(Math.random() * x);
    }
    
    function colour() {
        let char = ["a", "b", "c", "d", "e", "f", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
        let hex = "#";
    
        for (let i = 0; i < 6; i++) {
            hex += char[Math.floor(Math.random() * char.length)];
        }
        return hex;
    }
    
    function draw(x, y, size, colour, border, transparency) {
        context.beginPath();
        context.rect(x, y, size, size);
        context.globalAlpha = transparency;
        context.fillStyle = colour;
        context.fill();
        context.strokeStyle = border;
        context.stroke();
    }

    class Boost {
        constructor(size) {
            this.size = size;
            this.x = random(width - this.size);
            this.y = random(height - this.size);
            this.born = Date.now();
            console.log(this.born);
            this.exist = true;
        }

        spawn() {
            if (this.born + 5000 > Date.now()) {
                context.beginPath();
                context.arc(this.x, this.y, this.size / 2, 0, 360);
                context.globalAlpha = 1;
                context.fillStyle = colour();
                context.fill()
            }
            else {
                this.exist = false;
            }

            if (p.x + p.size >= this.x - (this.size/2) && p.x <= this.x + this.size/2 && p.y + p.size >= this.y - (this.size/2) && p.y <= this.y + this.size/2) {
                p.size += this.size;
                this.exist = false;
            }
        }

    }
    
    let squares = [];
    let boosts = [];
    
    // SQUARE
    class square {
        constructor() {
            this.size = random(height) * random(100)/100 * 0.3;
            // this.size = random(height) * 0.3;
            this.x;
            this.y;
            this.x_direction = 0;
            this.y_direction = 0;
            this.speed = Math.random() * width * 0.1 + width * 0.005;
            this.exist = true;
            this.spawned = false;
            this.colour = colour();
    
            this.time_stamp = Date.now();
        }
    
        spawn() {
            let d = Math.ceil(Math.random() * ((width - this.size) + (height - this.size)) * 2);
    
            if (d <= width - this.size) {
                this.x = 0 - this.size;
                this.y = random(height - this.size);
                this.x_direction = 1;
            }
            else if (d <= (width - this.size) + (height - this.size)) {
                this.x = random(width - this.size);
                this.y = 0 - this.size;
                this.y_direction = 1;
            }
            else if (d <= 2 * (width - this.size) + (height - this.size)) {
                this.x = width;
                this.y = random(height - this.size);
                this.x_direction = -1;
            }
            else {
                this.x = random(width - this.size);
                this.y = height;
                this.y_direction = -1;
            }
        }
    
        pos() {
            this.time_passed = (Date.now() - this.timestamp) / 1000;
            this.timestamp = Date.now();
    
            if (p.x + p.size >= this.x && p.x <= this.x + this.size && p.y + p.size >= this.y && p.y <= this.y + this.size) {
                if (this.size - 2 > p.size) {
                    p.exist = false;
                }
                if (this.size < p.size) {
                    this.exist = false;
                    let increase = 1.2 * Math.pow(this.size, 2) / Math.pow(p.size, 2);  // *2
                    console.log(p.size);
                    p.size += increase;
                    p.x -= increase/2;
                    p.y -= increase / 2;
                }
            }
            else if (this.x > width || this.x + this.size < 0 || this.y > height || this.y + this.size < 0) {
                this.exist = false;
            }
    
            this.x += this.x_direction * this.speed * this.time_passed;
            this.y += this.y_direction * this.speed * this.time_passed;
        }
        
        draw(x, y, size, transparency) {
            draw(x, y, size, this.colour, "white", transparency);
        }
    }
    
    // PLAYER
    class player extends square {
        constructor() {
            super();
            this.size = height/64;
            this.x = width/2 - this.size/2;
            this.y = height/2 - this.size/2;
            this.colour = "white";
            this.border = "white";
            
            this.max_speed = 500;
            this.a = this.get_a()
            this.up_speed = 0;
            this.down_speed = 0;
            this.left_speed = 0;
            this.right_speed = 0;
            
        }

        get_a() {
            return 0.005 * width;
        }
        
        pos() {  // d = s * t  => xy = speed * t
            let t = (Date.now() - this.time_stamp) / 1000;  // game_loop interval / 1000 (s => ms)
            this.time_stamp = Date.now();
            
            if (up) { 
                this.y -= this.up_speed * t;  // move up
                
                if (this.up_speed < this.max_speed) {  // accelerate up
                    this.up_speed += this.a;  
                } 
            }
            if (!(up) && this.up_speed > 0) {  // decelerate up
                this.y -= this.up_speed * t;
                this.up_speed -= this.a;
            }
            
            if (down) {  
                this.y += this.down_speed * t;  // move down
                
                if (this.down_speed < this.max_speed) {  // accelerate down
                    this.down_speed += this.a;
                }
            } 
            if (!(down) && this.down_speed > 0) {  // decelerate down
                this.y += this.down_speed * t;
                this.down_speed -= this.a;
            }
            
            if (right) {  
                this.x += this.right_speed * t;  // move right
                
                if (this.right_speed < this.max_speed) {  // accelerate right
                    this.right_speed += this.a;
                }
            }
            if (!(right) && this.right_speed > 0) {  // decelerate right
                this.x += this.right_speed * t;
                this.right_speed -= this.a;
            }
            
            if (left) {
                this.x -= this.left_speed * t;  // move left
                
                if (this.left_speed < this.max_speed) {  // accelerate left
                    this.left_speed += this.a;
                }
            }
            if (!(left) && this.left_speed > 0) {  // decelerate left
                this.x -= this.left_speed * t;
                this.left_speed -= this.a;
            }   
                                    
            // PASSING RIGHT BORDER
            if (this.x + this.size > width) {  
                draw(this.x - width, this.y, this.size, "white", null, 1);
            }
            if (this.x >= width) {
                this.x -= width;
            }
    
            // PASSING LEFT BORDER
            if (this.x < 0) {
                draw(this.x + width, this.y, this.size, "white", null, 1);
            }
            if (this.x + this.size <= 0) {
                this.x += width;
            }
    
            // PASSING TOP BORDER  (AND RIGHT/LEFT)
            if (this.y < 0) {
                draw(this.x, this.y + height, this.size, "white", null, 1);
    
                if (this.x + this.size > width) {
                    draw(this.x - width, this.y + height, this.size, "white", null, 1);
                }
                if (this.x < 0) {
                    draw(this.x + width, this.y + height, this.size, "white", null, 1);
                }
            }
            if (this.y + this.size < 0) {
                this.y += height;
            }
    
            // PASSING BOTTOM BORDER  (AND RIGHT/LEFT)
            if (this.y + this.size > height) {
                draw(this.x, this.y - height, this.size, "white", null, 1); 
    
                if (this.x + this.size > width) {
                    draw(this.x - width, this.y - height, this.size, "white", null, 1);
                }
                if (this.x < 0) {
                    draw(this.x + width, this.y - height, this.size, "white", null, 1);
                }
            }
            if (this.y > height) {
                this.y = 0;
            }
        }
    }
    
    let p = new player();
    let s = new square();
    squares.push(s);
    let spawn_square;

    function sspawn() {
        spawn_square = setInterval(function() {
            if (squares.length < 99) {
                squares.push(new square());
            }
        }, 600); // was 600
    }

    let pause_speed = [0];
    let pause = false;
        
    function game_loop() {

        // ================= PAUSE ===================== //
        console.log(pause);

        if (pause) {
            if (pause_speed.length == 0) {
                for (let square of squares) {
                    pause_speed.push(square.speed);
                    square.speed = 0;
                }
  
                clearInterval(spawn_square);
            }

            p.up_speed = 0;
            p.down_speed = 0;
            p.left_speed = 0;
            p.right_speed = 0;
        }

        else {
            if (pause_speed.length != 0) {
                for (let i in squares) {
                    squares[i].speed = pause_speed[i];
                }
                
                pause_speed = [];
                sspawn();
            }
            
        }

        context.clearRect(0, 0, width, height);

        // ======================= BOOST ==================== //
        if (Meniscus == 1) {
            Meniscus += 1;
            boosts.push(new Boost(10));
        }
        if (Shave == 1) {
            Shave += 1;
            boosts.push(new Boost(10));
        }

        for (let b in boosts) {
            if (boosts[b].exist == false) {
                boosts.splice(b, 1);
            }
        }
        for (let b of boosts) {
            b.spawn();
        }
        
        draw(p.x, p.y, p.size, p.colour, p.border,  1);
        
        for (let s in squares) {
            if (squares[s].exist === false) {
                squares.splice(s, 1);
            } 
        }
        
        for (let square of squares) {
            square.draw(square.x, square.y, square.size, 0.7);
            square.pos();
        }
        
        if (squares.length > 0) {
            if (squares[squares.length - 1].spawned === false) {
                squares[squares.length - 1].spawn();  // I don't know why this doesn't work when I put it in the same code block for creating it
                squares[squares.length - 1].spawned = true;
            }    
        }

        // =============== DISPLAY SIZE ============== //
        context.beginPath();
        context.globalAlpha = 0.2;
        context.font = `10px comic-sans`;
        context.fillStyle = 'white';
        context.fillText(`${Math.floor(p.size)}`, p.x + p.size, p.y - 10);
        
        if (p.exist) {
            if (p.size > height * 0.3) {
                document.body.innerHTML = "you win bla bla"
            }
            else {
                window.requestAnimationFrame(game_loop);
            }
        }
        else {
            context.beginPath();
            context.globalAlpha = 1;
            context.font = `${height/20}px comic-sans`;
            context.fillStyle = "white";
            context.fillText("You died!!!!!!!!!", p.x + p.size/2 - height/10, p.y - 10);
            if (p.size >= 50) {
                // alert("Secret code: Meniscus");
                context.beginPath();
                context.font = "10px comic-sans";
                context.fillText("Secret code: meniscus", p.x + p.size/2 - height/10, p.y + p.size + 10);
            }
            restart();
        }
        p.pos();
    }
    
    game_loop();
}


function restart() {
    canvas.addEventListener("click", play);
}

start();
