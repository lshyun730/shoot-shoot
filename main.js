'use strict';
const BACKGROUND_SPEED=-4;
const SHIP_SPEED = 15;
const HEART = 3;
const MISSILE_SPEED = 60;
const SHIP_ENEMY_COLLISION=50;  
const ENEMY_MISSILE_COLLISION=20;  

function imagesRepo(){
    this.enemyblack = new Image();
    this.enemyblack.src = "images/enemyblack.png";
    this.enemyblack.onload = function () { this.isLoaded = true;};
    this.enemyblack.verticalImageFrames = 1;
    this.enemyblack.horizontalImageFrames = 4;

    this.enemygreen = new Image();
    this.enemygreen.src = "images/enemygreen.png";
    this.enemygreen.onload = function () { this.isLoaded = true;};
    this.enemygreen.verticalImageFrames = 1;
    this.enemygreen.horizontalImageFrames = 4;
    
    this.enemyred = new Image();
    this.enemyred.src = "images/enemyred.png";
    this.enemyred.onload = function () { this.isLoaded = true;};
    this.enemyred.verticalImageFrames = 1;
    this.enemyred.horizontalImageFrames = 4;
    
    this.enemywhite = new Image();
    this.enemywhite.src = "images/enemywhite.png";
    this.enemywhite.onload = function () { this.isLoaded = true;};
    this.enemywhite.verticalImageFrames = 1;
    this.enemywhite.horizontalImageFrames = 4;

    this.ship = new Image();
    this.ship.src = "images/ship.png";
    this.ship.onload = function () { this.isLoaded = true;};
    this.ship.verticalImageFrames = 1;
    this.ship.horizontalImageFrames = 1;

    this.missile = new Image();
    this.missile.src = "images/missile.png";
    this.missile.onload = function () { this.isLoaded = true;};
    this.missile.verticalImageFrames = 1;
    this.missile.horizontalImageFrames = 1;
    
    this.background = new Image();
    this.background.src = "images/field.png";
    this.background.onload = function () { this.isLoaded = true;};
    this.background.verticalImageFrames = 1;
    this.background.horizontalImageFrames = 1;

    this.explosion = new Image();
    this.explosion.src = "images/explode.png";
    this.explosion.onload = function () { this.isLoaded = true;};
    this.explosion.verticalImageFrames = 1;
    this.explosion.horizontalImageFrames = 9;

    this.logo = new Image();
    this.logo.src = "images/logo.png";
    this.logo.onload = function () { this.isLoaded = true;};
    this.logo.verticalImageFrames = 1;
    this.logo.horizontalImageFrames = 1;

    this.heart = new Image();
    this.heart.src = "images/heart.png";
    this.heart.onload = function () { this.isLoaded = true;};
    this.heart.verticalImageFrames = 1;
    this.heart.horizontalImageFrames = 1;

    this.getImageFor = function (item, enemyNum) {
        if(item instanceof ship) return this.ship;
        if(item instanceof missile) return this.missile;
        if(item instanceof background) return this.background;
        if(item instanceof explosion) return this.explosion;
        if(item instanceof logo) return this.logo;
        if(item instanceof heart) return this.heart;
        if(item instanceof enemy && enemyNum == 1) return this.enemyblack;
        if(item instanceof enemy && enemyNum == 2) return this.enemyred;
        if(item instanceof enemy && enemyNum == 3) return this.enemygreen;
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
    this.heart = HEART;
    this.paused=false;
    this.started=false;
}
scene.prototype.countOf = function (type) {
    var c = 0;
    this.gameItems.forEach(
        function (item, index) {
            if (item instanceof type) c++;
        });
    return c;
}
scene.prototype.initEnemies = function () {
    const t = this;
    t.gameItems.push(new enemy(0, 0, 1));

    // black enemy
    setInterval(function () { t.gameItems.push(new enemy(0, 0, 1)); }, 2000);
    
    // red enemy
    setInterval(function () { 
        for (var i = 0; i < 3 ; i++) {
            setTimeout(function () {
                t.gameItems.push(new enemy(0, 0, 2));
            }, 1000 * i);
        } 
    }, 8000);
    
    // greem enemy
    setInterval(function () { t.gameItems.push(new enemy(0, 0, 3)); },4000);

    // white enemy
    setInterval(function () {
        const y = getRandom(0, canvas.height - 100);
        for (var i = 0; i < 5 ; i++) {
            setTimeout(function () {
                t.gameItems.push(new enemy(0, y, 4));
            }, 200 * i);
        } 
    }, 5000);
}
scene.prototype.init = function() {
    this.gameItems.push(new background(0, 0));
    this.ship = (new ship(150, 300));
    const t = this;
    t.drawAll();
}
scene.prototype.drawAll = function() {
    this.gameTicks++;
    if (this.gameTicks == 1000) this.gameTicks = 0;
    
    purgeTbd(this.gameItems);
    this.gameItems.sort(compareZindex);

    if (!this.paused){
        this.gameItems.forEach(
            function(item, index) {
                item.draw();
        });
    }
    
    this.setScore();

    if (this.heart <= 0) this.ship.isDead = true;
    if (this.ship.isDead) this.gameOver();
	if (!this.started) this.clickToStart();

    
    const t = this;
    requestAnimationFrame(function () {
        t.drawAll()
    });
}
scene.prototype.setScore = function () {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.font = '30pt Impact';
    ctx.textAlign = "left";
    ctx.fillText("SCORE: " + this.score, 60, 80);
}
scene.prototype.setHeart = function () {
    this.heartX = 50;
    for(var i = 0 ; i < this.heart ; i++){
        this.gameItems.push(new heart(this.heartX, 0));
        this.heartX += 60; 
    }
}
scene.prototype.gameStart=function(){
    this.gameItems.push(this.ship);
    this.setHeart();
    this.initEnemies();
}
scene.prototype.clickToStart=function(){
    new logo(0, 0).draw();
    ctx.save();
    ctx.font = '40pt Impact';
    ctx.textAlign = "center";
    ctx.fillText("Click to start", canvas.width / 2, 100 + canvas.height / 2);
    ctx.restore();
};
scene.prototype.gameOver=function(){
    ctx.save();
    ctx.font = '40pt Impact';
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    ctx.restore();
}

function ship(x, y) {
    gameObject.call(this, x, y);
    this.zindex = 1000;
    this.xTarget = x;
    this.yTarget = y;
    this.isDead = false;
    this.shield = false;
}
ship.prototype = Object.create(gameObject.prototype);
ship.prototype.draw = function() {
    if(!this.image.isLoaded == true || this.isDead) return;

    this.y = this.y + ((this.yTarget - this.y));
    ctx.drawImage(this.image, this.x , this.y, this.image.width, this.image.height);
    
    if(keyState['ArrowUp'] == 'on' && this.y > 0) myscene.ship.yTarget -= SHIP_SPEED;
    if(keyState['ArrowDown'] == 'on' && this.y < canvas.height - this.image.height) myscene.ship.yTarget += SHIP_SPEED;
    

    if(this.shield) this.globalAlpha = 0.5;
    const t = this;
    
    myscene.gameItems.forEach(
        function(item){
            if(item instanceof enemy) {
                if (collisionArea(item, t) > SHIP_ENEMY_COLLISION && !myscene.ship.shield) {
                    myscene.ship.shield = true;
                    myscene.heart -= 1;
                    for (var i=myscene.gameItems.length-1;i>=0;i--) {
                        if (myscene.gameItems[i] instanceof heart) myscene.gameItems.pop(i);
                        break;
                    }
                    setTimeout(function() {myscene.ship.shield = false}, 5000);
                    t.explode(100,t.x,t.y);
                }
            }
        }
    )
}
ship.prototype.shootToEnemy = function() {
    if(this.isDead) return;
    myscene.gameItems.push(new missile(this.x + this.image.width - 30 ,this.y + (this.image.height / 2)));
}
ship.prototype.explode=function(damage,posx,posy){
    myscene.gameItems.push(new explosion(posx, posy));
}


function background(x, y){
    gameObject.call(this, x, y);
    this.zindex = 0;
    this.x = 0;
    this.draw = function() {
        if(!this.image.isLoaded == true) return;
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
        if (!this.image.isLoaded == true) return;
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
                            item.explode(item.score);
                        }
                    }
                }
            });
        ctx.drawImage(this.image, this.x, this.y);
    }
}
missile.prototype = Object.create(gameObject.prototype);

function enemyPattern(enemy) {
    switch (enemy.enemyNum) {
        case 1 :
            enemy.speedX = 8;
            enemy.score = 10;
            break;
        case 2 :
            enemy.score = 50;
            if(enemy.heart == 2) enemy.heart = 1;
            enemy.speedX = 20;
            enemy.speedY = 5;
            break;
        case 3 :          
            enemy.speedX = 10;
            enemy.score = 30;
            if (enemy.enemyTicks > 0 && enemy.enemyTicks < 50) enemy.speedY = 0;
            if (enemy.enemyTicks > 50 && enemy.enemyTicks < 60) enemy.speedY = -20;
            if (enemy.enemyTicks > 60 && enemy.enemyTicks < 90) enemy.speedY = 0;
            if (enemy.enemyTicks > 90 && enemy.enemyTicks < 100) enemy.speedY = 20;
            break;
        case 4 :
            enemy.score = 20;
            enemy.speedX = 12;
            if(enemy.enemyTicks < 80) {
                enemy.speedY = -2;
            }else{
                enemy.speedY = 2;
            }
            break;
        }
}


function enemy(x, y, enemyNum) {
    gameObject.call(this, x, y, enemyNum);
    this.x = canvas.width - 100;
    this.y = y;
    this.speedY = 0;
    this.zindex = 1000;
    this.heart = 2;
    this.enemyTicks = 0;
    this.enemyNum = enemyNum;
    if(this.enemyNum != 4) this.y = getRandom(0, canvas.height - this.image.height);
    if(this.enemyNum == 2) this.y = 100;

    
    this.draw = function() {
        if (!this.image.isLoaded == true) return;
        this.enemyTicks += 1;
        if (this.enemyTicks == 100) this.enemyTicks = 0;
        enemyPattern(this);

        this.x -= this.speedX;
        this.y += this.speedY;
        if (isTbd(this)) return;

        ctx.drawImage(this.image,
            0 + ((this.currentFrame - 1) * this.getFrameWidth()), 0, 
            this.getFrameWidth(), this.getFrameHeight(),
            this.x, this.y, this.getFrameWidth(), this.getFrameHeight());
            
            if (myscene.gameTicks % 5 == 0) this.nextImageFrame();
    }

    this.explode = function(score){
        myscene.score += score;
        this.tbd=true;
        myscene.gameItems.push(new explosion(this.x, this.y))
    }
}
enemy.prototype = Object.create(gameObject.prototype);

function explosion(x, y){
    gameObject.call(this, x, y)
    this.zindex = 1000;
    this.draw = function(){
        if (!this.image.isLoaded == true) return;
        ctx.drawImage(this.image,
            0 + ((this.currentFrame - 1) * this.getFrameWidth()), 0,
            this.getFrameWidth(), this.getFrameHeight(),
            this.x - 32 , this.y - 32 , this.getFrameWidth(), this.getFrameHeight());
        
            if (true)this.nextImageFrame(true);
    }
}
explosion.prototype = Object.create(gameObject.prototype);

function logo(x, y) {
    gameObject.call(this, x, y);
    this.x = canvas.width / 2 - this.image.width / 2;
    this.y = canvas.height / 2 - 250 ;
    this.zindex = 1000;
    this.draw = function(){
        if (!this.image.isLoaded == true) return;
        ctx.drawImage(this.image, this.x , this.y, this.image.width, this.image.height);
    }
}

function heart(x, y) {
    gameObject.call(this, x, y);
    this.zindex = 10000;
    this.x = x;
    this.y = 100;
    this.zindex = 2000;
    this.draw = function(){
        if (!this.image.isLoaded == true) return;
        ctx.drawImage(this.image, this.x , this.y, this.image.width, this.image.height);
    }
}



//util

//sort array by zindex property
function compareZindex(a, b) {
    if (a.zindex < b.zindex)
        return -1;
    else
        return 1;
}

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
const keyState = {}
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.addEventListener('click', function (e) {
    if (!myscene.started) {
        myscene.started=true;
        myscene.ship.isDead=false;
        myscene.score=0;
        for (var i=myscene.gameItems.length-1;i>=0;i--) {
            if (myscene.gameItems[i] instanceof enemy) myscene.gameItems.splice(i,1);
        }
        myscene.gameStart();
    }
});

canvas.addEventListener('keydown', (e) => {
    keyState[e.key] = 'on';
    if(e.key == 'ArrowRight' || e.keyCode == 32) {
        myscene.ship.shootToEnemy();
    }
})

canvas.addEventListener('keyup', (e) => {
    keyState[e.key] = undefined;
})

const ctx = canvas.getContext("2d");
const images = new imagesRepo();
const myscene = new scene();

myscene.init();