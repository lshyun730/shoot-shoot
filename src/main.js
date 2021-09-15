'use strict';
const BACKGROUND_SPEED=-4;
const SHIP_SPEED = 20;
const MISSILE_SPEED = 30;

function imagesRepo(){
    this.enemyblack = new Image();
    this.enemyblack.src = "../images/enemyblack.png";
    this.enemyblack.onload = function () { this.isLoaded = true;};
    this.enemyblack.verticalImageFrames = 1;
    this.enemyblack.horizontalImageFrames = 4;

    this.enemygreen = new Image();
    this.enemygreen.src = "../images/enemygreen.png";
    this.enemygreen.onload = function () { this.isLoaded = true;};
    this.enemygreen.verticalImageFrames = 1;
    this.enemygreen.horizontalImageFrames = 4;
    
    this.enemyred = new Image();
    this.enemyred.src = "../images/enemyred.png";
    this.enemyred.onload = function () { this.isLoaded = true;};
    this.enemyred.verticalImageFrames = 1;
    this.enemyred.horizontalImageFrames = 4;
    
    this.enemywhite = new Image();
    this.enemywhite.src = "../images/enemywhite.png";
    this.enemywhite.onload = function () { this.isLoaded = true;};
    this.enemywhite.verticalImageFrames = 1;
    this.enemywhite.horizontalImageFrames = 4;

    this.ship = new Image();
    this.ship.src = "../images/ship.png";
    this.ship.onload = function () { this.isLoaded = true;};
    this.ship.verticalImageFrames = 1;
    this.ship.horizontalImageFrames = 1;

    this.missile = new Image();
    this.missile.src = "../images/missile.png";
    this.missile.onload = function () { this.isLoaded = true;};
    this.missile.verticalImageFrames = 1;
    this.missile.horizontalImageFrames = 1;
    
    this.background = new Image();
    this.background.src = "../images/field.png";
    this.background.onload = function () { this.isLoaded = true;};
    this.background.verticalImageFrames = 1;
    this.background.horizontalImageFrames = 1;

    this.getImageFor = function (item, enemyNum) {
        if(item instanceof ship) return this.ship;
        if(item instanceof missile) return this.missile;
        if(item instanceof background) return this.background;
        if(item instanceof enemy && enemyNum == 1) return this.enemyblack;
        if(item instanceof enemy && enemyNum == 2) return this.enemygreen;
        if(item instanceof enemy && enemyNum == 3) return this.enemyred;
        if(item instanceof enemy && enemyNum == 4) return this.enemywhite;
    }
}

function gameObject(x, y, enemyNum) {
    this.x = x;
    this.y = y;
    this.currentFrame = 1;
    this.image = images.getImageFor(this, enemyNum);
}
gameObject.prototype.getFrameHeight = function () {
    return this.image.height / this.image.verticalImageFrames;
}
gameObject.prototype.getFrameWidth = function () {
    return this.image.width / this.image.horizontalImageFrames;
}
gameObject.prototype.nextImageFrame = function (onlyOnce) {
    this.currentFrame++;

    if (this.currentFrame > this.image.verticalImageFrames * this.image.horizontalImageFrames) {
        if (onlyOnce)
            this.tbd = true;
        else
            this.currentFrame = 1;
    }
}

function scene() {
    this.gameItems = [];
    this.ship = null;
    this.gameTicks = 0;
    this.score = 0;
    this.paused=false;
    this.started=false;
}

scene.prototype.init = function() {
    this.gameItems.push(new background(0, 0));
    this.ship = (new ship(150, 300))
    this.gameItems.push(this.ship);
    const t = this;
    // t.gameItems.push(new enemy(0,0));
    setInterval(function () { t.gameItems.push(new enemy(0, 0, 1)); }, 6000);
    setInterval(function () { t.gameItems.push(new enemy(0, 0, 2)); }, 8000);
    setInterval(function () { t.gameItems.push(new enemy(0, 0, 3)); }, 10000);
    setInterval(function () { t.gameItems.push(new enemy(0, 0, 3)); }, 10000);
    t.drawAll();
}
scene.prototype.drawAll = function() {
    this.gameTicks++;
    if (this.gameTicks == 1000) this.gameTicks = 0;
    if (!this.paused){
        this.gameItems.forEach(
            function (item) {
                item.draw();
        });
    }

    const t = this;
    requestAnimationFrame(function () {
        t.drawAll()
    });
}

function ship(x, y) {
    gameObject.call(this, x, y);
    this.zindex = 1000;
    this.xTarget = x;
    this.yTarget = y;
    this.isDead = false;
}
ship.prototype = Object.create(gameObject.prototype);
ship.prototype.draw = function() {
    if(this.image.isLoaded == false || this.isDead) return;
    this.y = this.y + ((this.yTarget - this.y));
    ctx.drawImage(this.image, this.x , this.y, this.image.width, this.image.height);
}
ship.prototype.shootToEnemy = function() {
    if(this.isDead) return;
    myscene.gameItems.push(new missile(this.x + this.image.width - 30 ,this.y + (this.image.height/2)));
}

function background(x, y){
    gameObject.call(this, x, y);
    this.zindex = 0;
    this.x = 0;
    this.draw = function() {
        if(this.image.isLoaded == false) return;
        this.x += BACKGROUND_SPEED;
        ctx.drawImage(this.image, this.x, 0, this.image.width, canvas.height);
        var rightLimit = this.x + this.image.width;

        while (rightLimit < canvas.width) {
            ctx.drawImage(this.image, rightLimit + 1, 0, this.image.width, canvas.height);
            rightLimit += this.image.width;
        }
        if (this.x + this.image.width < 0) this.x = 0;
    }
}
background.prototype = Object.create(gameObject.prototype);

function missile(x, y){
    gameObject.call(this, x, y);
    this.draw = function() {
        if(this.image.isLoaded == false) return;
        this.x += MISSILE_SPEED;

        ctx.drawImage(this.image, this.x, this.y);
    }
}
missile.prototype = Object.create(gameObject.prototype);


function enemy(x, y, enemyNum) {
    gameObject.call(this, x, y, enemyNum);
    this.x = canvas.width - 100;
    this.y = getRandom(0, canvas.height);
    this.zindex = 1000;
    this.enemyNum = enemyNum;
    
    switch (this.enemyNum) {
        case 1 :
            this.speedX = 3;
            break;
        case 2 :
            this.speedX = 6;
            break;
        case 3 :
            this.speedX = 10;
            break;
        case 4 :
            this.speedX = 8;
            
            break;
    }

    this.draw = function() {
        if (this.image.isLoaded == false) return;
        this.x -= this.speedX;
        ctx.drawImage(this.image,
            0 + ((this.currentFrame - 1) * this.getFrameWidth()), 0, 
            this.getFrameWidth(), this.getFrameHeight(),
            this.x, this.y, this.getFrameWidth(), this.getFrameHeight());
            if (myscene.gameTicks % 10 == 0) this.nextImageFrame();
    }
}
enemy.prototype = Object.create(gameObject.prototype);



//util

//get random null
function getRandom(min, max) {
    return Math.floor((Math.random() * max) + min);
}

function moveship() {
    if(keys['ArrowUp']){
        myscene.ship.yTarget -= SHIP_SPEED;
    }else if(keys['ArrowDown']){
        myscene.ship.yTarget += SHIP_SPEED;
    }
}
// script start 

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.addEventListener('keydown', (e) => {
    if(e.key == 'ArrowUp'){
        myscene.ship.yTarget -= SHIP_SPEED;
    }else if(e.key == 'ArrowDown') {
        myscene.ship.yTarget += SHIP_SPEED;
    }
})

canvas.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        myscene.ship.shootToEnemy();
    }
})

const ctx = canvas.getContext("2d");
const images = new imagesRepo();
const myscene = new scene();

myscene.init();