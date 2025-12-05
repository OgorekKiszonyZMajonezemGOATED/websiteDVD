const canvas = document.getElementById("gra");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");
let elapsed;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const playerImage = new Image();
playerImage.src = "GFX/yt.png";
const dvdImage = new Image();
dvdImage.src = "GFX/dvd.png";

class Gracz {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.radius = 150;
        this.velocity = 6;
        this.direction = { up: false, down: false, left: false, right: false };
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(playerImage, this.x, this.y, this.radius, this.radius);
    }

    update() {
        if (this.direction.up && this.y > 0) this.y -= this.velocity;
        if (this.direction.down && this.y + this.radius < canvas.height) this.y += this.velocity;
        if (this.direction.left && this.x > 0) this.x -= this.velocity;
        if (this.direction.right && this.x + this.radius < canvas.width) this.x += this.velocity;

        this.draw();
    }

    checkCollision(dvd) {
        const dx = this.x + this.radius / 2 - (dvd.x + dvd.radius / 2);
        const dy = this.y + this.radius / 2 - (dvd.y + dvd.radius / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (this.radius / 2 + dvd.radius / 2)) {
            return true; 
        }
        return false;
    }
}


class Dvd {
    constructor() {
        this.x = Math.random() * (canvas.width - 200) + 100;
        this.y = Math.random() * (canvas.height - 200) + 100;
        this.radius = 100;
        this.dx = 4;
        this.dy = 4;
       
    }

    draw() {
        ctx.fillStyle = this.color; 
        ctx.drawImage(dvdImage, this.x, this.y, this.radius, this.radius);
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;


        if (this.x + this.radius > canvas.width || this.x < 0) {
            this.dx = -this.dx;

        }

        if (this.y + this.radius > canvas.height || this.y < 0) {
            this.dy = -this.dy;
        
        }

        this.draw();
    }
}

let dvdArray = [];
let gameOver = false;
let startTime = Date.now();
const gracz = new Gracz();

function createNewDvd() {
    if (dvdArray.length < 15) {
        dvdArray.push(new Dvd());
    }
}

setInterval(createNewDvd, 3000);

function drawTimer() {
    elapsed = ((Date.now() - startTime) / 1000);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Czas: ' + elapsed + 's', 10, 30);
}

function animate() {
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.fillText('GAME OVER '+elapsed + "s", canvas.width / 2 - 100, canvas.height / 2);
        restartBtn.style.display = 'block';
        return;
    }

    gracz.update();

    for (let i = 0; i < dvdArray.length; i++) {
        dvdArray[i].update();
        if (gracz.checkCollision(dvdArray[i])) {
            gameOver = true;
        }
    }

    drawTimer();
    requestAnimationFrame(animate);
}

animate();

document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowUp") gracz.direction.up = true;
    if (e.key === "ArrowDown") gracz.direction.down = true;
    if (e.key === "ArrowLeft") gracz.direction.left = true;
    if (e.key === "ArrowRight") gracz.direction.right = true;
});

document.addEventListener("keyup", function (e) {
    if (e.key === "ArrowUp") gracz.direction.up = false;
    if (e.key === "ArrowDown") gracz.direction.down = false;
    if (e.key === "ArrowLeft") gracz.direction.left = false;
    if (e.key === "ArrowRight") gracz.direction.right = false;
});

restartBtn.addEventListener("click", function () {
    gameOver = false;
    dvdArray = [];
    startTime = Date.now();
    restartBtn.style.display = 'none'; 
    animate();  
});
