'use strict';
const BACKGROUND_SPEED=-4;
const SHIP_SPEED = 20;
const MISSILE_SPEED = 30;
const SHIP_ENEMY_COLLISION=50;  
const ENEMY_MISSILE_COLLISION=20;  

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

    this.explosion = new Image();
    this.explosion.src = "../images/explode.png";
    this.explosion.onload = function () { this.isLoaded = true;};
    this.explosion.verticalImageFrames = 1;
    this.explosion.horizontalImageFrames = 9;

    this.getImageFor = function (item, enemyNum) {
        if(item instanceof ship) return this.ship;
        if(item instanceof missile) return this.missile;
        if(item instanceof background) return this.background;
        if(item instanceof explosion) return this.explosion;
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
scene.prototype.countOf = function (type) {
    var c = 0;
    this.gameItems.forEach(
        function (item, index) {
            if (item instanceof type) c++;
        });
        console.log(c);
    return c;
}
scene.prototype.initEnemies = function () {
    const t = this;
    t.gameItems.push(new enemy(0, 0, 1));
    setInterval(function () { t.gameItems.push(new enemy(0, 0, 1)); }, 3000);
    // setInterval(function () { t.gameItems.push(new enemy(0, 0, 2)); }, 8000);
    // setInterval(function () { t.gameItems.push(new enemy(0, 0, 3)); }, 10000);
}
scene.prototype.init = function() {
    this.gameItems.push(new background(0, 0));
    this.ship = (new ship(150, 300))
    this.gameItems.push(this.ship);
    const t = this;
    t.drawAll();
}
scene.prototype.drawAll = function() {
    this.gameTicks++;
    if (this.gameTicks == 1000) this.gameTicks = 0;

    purgeTbd(this.gameItems);

    if (!this.paused){
        this.gameItems.forEach(
            function (item) {
                item.draw();
        });
    }

    if (this.ship.isDead) this.gameOver();
	if (!this.started) this.clickToStart();

    const t = this;
    requestAnimationFrame(function () {
        t.drawAll()
    });
}
scene.prototype.clickToStart=function(){
    ctx.save();
    ctx.font = '40pt Impact';
    ctx.textAlign = "center";
    ctx.fillText("Click/tap to start", canvas.width / 2, 50+ canvas.height / 2);
    ctx.restore();
};

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

    const t = this;

    myscene.gameItems.forEach(
        function(item){
            if(item instanceof enemy) {
                if (collisionArea(item, t) > SHIP_ENEMY_COLLISION) {
                    t.explode(100,t.x,t.y);
                }
            }
        }
    )
}
ship.prototype.shootToEnemy = function() {
    if(this.isDead) return;
    myscene.gameItems.push(new missile(this.x + this.image.width - 30 ,this.y + (this.image.height/2)));
}
ship.prototype.explode=function(damage,posx,posy){
    myscene.gameItems.push(new explosion(posx, posy));
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
        if (this.image.isLoaded == false) return;
        this.x += MISSILE_SPEED;
        if (isTbd(this)) return;
        var t = this;

        myscene.gameItems.forEach(
            function (item, index) {
                if (item instanceof enemy) {
                    if (collisionArea(item, t) > ENEMY_MISSILE_COLLISION) {
                        t.tbd = true;
                        item.heart -= 1;
                        if (item.heart == 0) {
                            item.explode();
                        }else {

                        }
                    }
                }
            });
        ctx.drawImage(this.image, this.x, this.y);
    }
}
missile.prototype = Object.create(gameObject.prototype);


function enemy(x, y, enemyNum) {
    gameObject.call(this, x, y, enemyNum);
    this.x = canvas.width - 100;
    this.y = getRandom(0, canvas.height - this.image.height);
    this.zindex = 1000;
    this.enemyNum = enemyNum;
    
    switch (this.enemyNum) {
        case 1 :
            this.speedX = 6;
            this.heart = 2;
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
        if (isTbd(this)) return;

        ctx.drawImage(this.image,
            0 + ((this.currentFrame - 1) * this.getFrameWidth()), 0, 
            this.getFrameWidth(), this.getFrameHeight(),
            this.x, this.y, this.getFrameWidth(), this.getFrameHeight());
            
            if (myscene.gameTicks % 5 == 0) this.nextImageFrame();
    }

    this.explode = function(){
        this.tbd=true;
        myscene.gameItems.push(new explosion(this.x, this.y))
    }
}
enemy.prototype = Object.create(gameObject.prototype);

function explosion(x, y){
    gameObject.call(this, x, y)
    this.zindex = 1000;
    this.draw = function(){
        if (this.image.isLoaded == false) return;
        ctx.drawImage(this.image,
            0 + ((this.currentFrame - 1) * this.getFrameWidth()), 0,
            this.getFrameWidth(), this.getFrameHeight(),
            this.x - 32 , this.y - 32 , this.getFrameWidth(), this.getFrameHeight());
        
            if (true)this.nextImageFrame(true);
    }
}
explosion.prototype = Object.create(gameObject.prototype);


//util

//get random null
function getRandom(min, max) {
    return Math.floor((Math.random() * max) + min);
}


//return number of pixel in overlap
function collisionArea(ob1, ob2) {

    var overX = Math.max(0, Math.min(ob1.x + ob1.getFrameWidth(), ob2.x + ob2.getFrameWidth()) - Math.max(ob1.x, ob2.x))
    var overY = Math.max(0, Math.min(ob1.y + ob1.getFrameHeight(), ob2.y + ob2.getFrameHeight()) - Math.max(ob1.y, ob2.y));

    return overX * overY;
}

function isTbd(ob) {
    if (ob.x + ob.image.width < 0 || ob.x > canvas.width || ob.y + ob.image.height < 0 || ob.y > canvas.height) {
        ob.tbd = true;
        return true;
    }
    else return false;
}

// delete array elements marked with tbd property
function purgeTbd(arr) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i].tbd) {
            arr.splice(i, 1);
        }
    }
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
canvas.addEventListener('click', function (e) {
    if (!myscene.started) {
        myscene.started=true;
        myscene.ship.isDead=false;
        myscene.score=0;
        for (var i=myscene.gameItems.length-1;i>=0;i--)
        {
            if (myscene.gameItems[i] instanceof enemy) myscene.gameItems.splice(i,1);
        }
        myscene.initEnemies();
    }
});

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