'use strict';

import * as sound from './sound.js';

const BACKGROUND_SPEED = -4;
const SHIP_SPEED = 6;
const HEART = 3;
const MISSILE_SPEED = 30;
const SHIP_ENEMY_COLLISION = 50;
const ENEMY_MISSILE_COLLISION = 20;

// Image repository
function imagesList() {
  this.enemyblack = new Image();
  this.enemyblack.src = 'images/enemyblack.png';
  this.enemyblack.onload = function () {
    this.isLoaded = true;
  };
  this.enemyblack.verticalImageFrames = 1;
  this.enemyblack.horizontalImageFrames = 4;

  this.enemygreen = new Image();
  this.enemygreen.src = 'images/enemygreen.png';
  this.enemygreen.onload = function () {
    this.isLoaded = true;
  };
  this.enemygreen.verticalImageFrames = 1;
  this.enemygreen.horizontalImageFrames = 4;

  this.enemyred = new Image();
  this.enemyred.src = 'images/enemyred.png';
  this.enemyred.onload = function () {
    this.isLoaded = true;
  };
  this.enemyred.verticalImageFrames = 1;
  this.enemyred.horizontalImageFrames = 4;

  this.enemywhite = new Image();
  this.enemywhite.src = 'images/enemywhite.png';
  this.enemywhite.onload = function () {
    this.isLoaded = true;
  };
  this.enemywhite.verticalImageFrames = 1;
  this.enemywhite.horizontalImageFrames = 4;

  this.ship = new Image();
  this.ship.src = 'images/ship.png';
  this.ship.id = 'ship';
  this.ship.onload = function () {
    this.isLoaded = true;
  };
  this.ship.verticalImageFrames = 1;
  this.ship.horizontalImageFrames = 1;

  this.missile = new Image();
  this.missile.src = 'images/missile.png';
  this.missile.onload = function () {
    this.isLoaded = true;
  };
  this.missile.verticalImageFrames = 1;
  this.missile.horizontalImageFrames = 1;

  this.background = new Image();
  this.background.src = 'images/field.png';
  this.background.onload = function () {
    this.isLoaded = true;
  };
  this.background.verticalImageFrames = 1;
  this.background.horizontalImageFrames = 1;

  this.explosion = new Image();
  this.explosion.src = 'images/explode.png';
  this.explosion.onload = function () {
    this.isLoaded = true;
  };
  this.explosion.verticalImageFrames = 1;
  this.explosion.horizontalImageFrames = 9;

  this.logo = new Image();
  this.logo.src = 'images/logo.png';
  this.logo.onload = function () {
    this.isLoaded = true;
  };
  this.logo.verticalImageFrames = 1;
  this.logo.horizontalImageFrames = 1;

  this.heart = new Image();
  this.heart.src = 'images/heart.png';
  this.heart.onload = function () {
    this.isLoaded = true;
  };
  this.heart.verticalImageFrames = 1;
  this.heart.horizontalImageFrames = 1;

  this.soundBtn = new Image();
  this.soundBtn.src = 'images/sound.png';
  this.soundBtn.onload = function () {
    this.isLoaded = true;
  };
  this.heart.verticalImageFrames = 1;
  this.heart.horizontalImageFrames = 1;

  this.start = new Image();
  this.start.src = 'images/start.png';
  this.start.id = 'btnStart';
  this.start.onload = function () {
    this.isLoaded = true;
  };
  this.start.verticalImageFrames = 1;
  this.start.horizontalImageFrames = 1;

  this.gameOverBtn = new Image();
  this.gameOverBtn.src = 'images/game_over.png';
  this.gameOverBtn.onload = function () {
    this.isLoaded = true;
  };
  this.gameOverBtn.verticalImageFrames = 1;
  this.gameOverBtn.horizontalImageFrames = 1;

  this.getImageFor = function (item, enemyNum) {
    if (item instanceof ship) return this.ship;
    if (item instanceof missile) return this.missile;
    if (item instanceof background) return this.background;
    if (item instanceof explosion) return this.explosion;
    if (item instanceof logo) return this.logo;
    if (item instanceof heart) return this.heart;
    if (item instanceof soundBtn) return this.soundBtn;
    if (item instanceof start) return this.start;
    if (item instanceof gameOverBtn) return this.gameOverBtn;
    if (item instanceof enemy && enemyNum == 1) return this.enemyblack;
    if (item instanceof enemy && enemyNum == 2) return this.enemyred;
    if (item instanceof enemy && enemyNum == 3) return this.enemygreen;
    if (item instanceof enemy && enemyNum == 4) return this.enemywhite;
  };
}

// Create game object
function gameObject(x, y, enemyNum) {
  this.x = x;
  this.y = y;
  this.currentFrame = 1;
  this.image = images.getImageFor(this, enemyNum);
}
gameObject.prototype.getFrameHeight = function () {
  return this.image.height / this.image.verticalImageFrames;
};
gameObject.prototype.getFrameWidth = function () {
  return this.image.width / this.image.horizontalImageFrames;
};
gameObject.prototype.nextImageFrame = function (onlyOnce) {
  this.currentFrame++;

  if (this.currentFrame > this.image.verticalImageFrames * this.image.horizontalImageFrames) {
    if (onlyOnce) this.tbd = true;
    else this.currentFrame = 1;
  }
};

function scene() {
  this.gameItems = [];
  this.ship = null;
  this.gameTicks = 0;
  this.score = 0;
  this.heart = HEART;
  this.paused = false;
  this.started = false;
}
scene.prototype.initEnemies = function () {
  const t = this;
  t.gameItems.push(new enemy(0, 0, 1));

  this.enemyIntervalList = [];
  // black enemy
  this.enemyIntervalList.push(setInterval(() => t.gameItems.push(new enemy(0, 0, 1)), 2000));

  // green enemy
  this.enemyIntervalList.push(setInterval(() => t.gameItems.push(new enemy(0, 0, 3)), 4000));

  // red enemy
  this.enemyIntervalList.push(
    setInterval(() => {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => t.gameItems.push(new enemy(0, 0, 2)), 1000 * i);
      }
    }, 8000)
  );

  // white enemy
  this.enemyIntervalList.push(
    setInterval(() => {
      const y = getRandom(100, canvas.height - 100);
      for (let i = 0; i < 5; i++) {
        setTimeout(() => t.gameItems.push(new enemy(0, y, 4)), 200 * i);
      }
    }, 5000)
  );
};
scene.prototype.init = function () {
  this.gameItems.push(new background(0, 0));
  this.ship = new ship(150, 300);
  const t = this;
  t.drawAll();
};
scene.prototype.drawAll = function () {
  this.gameTicks++;
  if (this.gameTicks == 1000) this.gameTicks = 0;

  purgeTbd(this.gameItems);
  this.gameItems.sort(compareZindex);

  if (!this.paused) this.gameItems.forEach((item) => item.draw());

  if (this.started) {
    this.setScore();
    this.setHeart();
    this.setSoundBtn();
  }

  if (this.ship.isDead) this.gameOver();
  if (!this.started) this.clickToStart();

  const t = this;
  requestAnimationFrame(function () {
    t.drawAll();
  });
};
scene.prototype.setScore = function () {
  ctx.fillStyle = 'black';
  ctx.font = '30pt Impact';
  ctx.textAlign = 'left';
  ctx.fillText('SCORE: ' + this.score, 60, 80);
};
scene.prototype.setHeart = function () {
  this.heartX = 50;
  for (let i = 0; i < this.heart; i++) {
    new heart(this.heartX, 0).draw();
    this.heartX += 60;
  }
};
scene.prototype.setSoundBtn = function () {
  this.soundBtn = new soundBtn(0, 0);
  this.soundBtn.draw();
};

scene.prototype.gameStart = function () {
  this.started = true;
  this.ship.isDead = false;
  this.score = 0;
  this.heart = HEART;
  sound.playBg();

  for (let i = this.gameItems.length - 1; i >= 0; i--) {
    if (this.gameItems[i] instanceof enemy) this.gameItems.splice(i, 1);
  }
  this.gameItems.push(this.ship);
  this.initEnemies();
};
scene.prototype.clickToStart = function () {
  new logo(0, 0).draw();
  this.start = new start(0, 0);
  this.start.draw();
};
scene.prototype.gameOver = function () {
  this.enemyIntervalList.map((enemyInterval) => {
    clearInterval(enemyInterval);
  });

  const highScore = localStorage.getItem('highScore') ? localStorage.getItem('highScore') : 0;
  if (highScore < this.score) localStorage.setItem('highScore', this.score);

  this.gameOverBtn = new gameOverBtn(0, 0);
  this.gameOverBtn.draw();

  ctx.save();
  ctx.font = '42pt Impact';
  ctx.textAlign = 'center';
  ctx.fillText(this.score, canvas.width / 2, canvas.height / 2 - 30);
  ctx.font = '30pt Impact';
  ctx.fillText(localStorage.getItem('highScore'), canvas.width / 2, canvas.height / 2 + 80);
  ctx.restore();

  sound.stopBg();
};

function ship(x, y) {
  gameObject.call(this, x, y);
  this.zindex = 1000;
  this.xTarget = x;
  this.yTarget = y;
  this.isDead = false;
  this.shield = false;
}
ship.prototype = Object.create(gameObject.prototype);
ship.prototype.draw = function () {
  if (!this.image.isLoaded == true || this.isDead) return;

  this.y = this.y + (this.yTarget - this.y);

  if (this.shield) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
    ctx.restore();
  } else {
    ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
    ctx.globalAlpha = 1;
  }

  if (keyState['ArrowUp'] == 'on' && this.y > 0) myscene.ship.yTarget -= SHIP_SPEED;
  if (keyState['ArrowDown'] == 'on' && this.y < canvas.height - this.image.height)
    myscene.ship.yTarget += SHIP_SPEED;

  const t = this;

  myscene.gameItems.forEach(function (item) {
    if (item instanceof enemy) {
      if (collisionArea(item, t) > SHIP_ENEMY_COLLISION && !myscene.ship.shield) {
        myscene.ship.shield = true;
        myscene.heart -= 1;
        if (myscene.heart === 0) myscene.ship.isDead = true;
        t.explode(t.x, t.y);
        setTimeout(() => (myscene.ship.shield = false), 5000);
      }
    }
  });
};
ship.prototype.shootToEnemy = function () {
  if (this.isDead) return;
  myscene.gameItems.push(
    new missile(this.x + this.image.width - 30, this.y + this.image.height / 2)
  );
  sound.playShoot();
};
ship.prototype.explode = function (posx, posy) {
  myscene.gameItems.push(new explosion(posx, posy));
};

function background(x, y) {
  gameObject.call(this, x, y);
  this.zindex = 0;
  this.x = 0;
  this.draw = function () {
    if (!this.image.isLoaded == true) return;
    this.x += BACKGROUND_SPEED;
    ctx.drawImage(this.image, this.x, 0, this.image.width, canvas.height);
    let rightLimit = this.x + this.image.width;

    while (rightLimit < canvas.width) {
      ctx.drawImage(this.image, rightLimit, 0, this.image.width, canvas.height);
      rightLimit += this.image.width;
    }
    if (this.x + this.image.width < 0) this.x = 0;
  };
}
background.prototype = Object.create(gameObject.prototype);

function missile(x, y) {
  gameObject.call(this, x, y);
  this.draw = function () {
    if (!this.image.isLoaded == true) return;
    this.x += MISSILE_SPEED;
    if (isTbd(this)) return;
    const t = this;

    myscene.gameItems.forEach(function (item) {
      if (item instanceof enemy) {
        if (collisionArea(item, t) > ENEMY_MISSILE_COLLISION) {
          item.explode();
          item.heart -= 1;
          t.tbd = true;
          sound.playExplode();
        }
      }
    });
    ctx.drawImage(this.image, this.x, this.y);
  };
}
missile.prototype = Object.create(gameObject.prototype);

function enemyPattern(enemy) {
  switch (enemy.enemyNum) {
    case 1:
      enemy.speedX = 4;
      break;
    case 2:
      enemy.score = 50;
      enemy.speedX = 10;
      enemy.speedY = 5;
      break;
    case 3:
      enemy.speedX = 5;
      enemy.score = 30;
      if (enemy.enemyTicks > 0 && enemy.enemyTicks < 50) enemy.speedY = 0;
      if (enemy.enemyTicks > 50 && enemy.enemyTicks < 60) enemy.speedY = -20;
      if (enemy.enemyTicks > 60 && enemy.enemyTicks < 90) enemy.speedY = 0;
      if (enemy.enemyTicks > 90 && enemy.enemyTicks < 100) enemy.speedY = 20;
      break;
    case 4:
      enemy.score = 20;
      enemy.speedX = 6;
      if (enemy.enemyTicks < 80) {
        enemy.speedY = -2;
      } else {
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
  this.score = 10;
  this.enemyTicks = 0;
  this.enemyNum = enemyNum;

  if (this.enemyNum == 1) this.y = getRandom(0, canvas.height - this.image.height);
  if (this.enemyNum == 2) this.y = 100;
  if (this.enemyNum == 3) this.y = getRandom(120, canvas.height - this.image.height);

  this.draw = function () {
    if (!this.image.isLoaded == true) return;
    this.enemyTicks += 1;
    if (this.enemyTicks == 100) this.enemyTicks = 0;
    enemyPattern(this);

    this.x -= this.speedX;
    this.y += this.speedY;
    if (isTbd(this)) return;

    ctx.drawImage(
      this.image,
      0 + (this.currentFrame - 1) * this.getFrameWidth(),
      0,
      this.getFrameWidth(),
      this.getFrameHeight(),
      this.x,
      this.y,
      this.getFrameWidth(),
      this.getFrameHeight()
    );

    if (myscene.gameTicks % 5 == 0) this.nextImageFrame();
  };

  this.explode = function () {
    myscene.score += this.score;
    this.tbd = true;
    myscene.gameItems.push(new explosion(this.x, this.y));
  };
}
enemy.prototype = Object.create(gameObject.prototype);

function explosion(x, y) {
  gameObject.call(this, x, y);
  this.zindex = 1000;
  this.draw = function () {
    if (!this.image.isLoaded == true) return;
    ctx.drawImage(
      this.image,
      0 + (this.currentFrame - 1) * this.getFrameWidth(),
      0,
      this.getFrameWidth(),
      this.getFrameHeight(),
      this.x - 32,
      this.y - 32,
      this.getFrameWidth(),
      this.getFrameHeight()
    );

    this.nextImageFrame(true);
  };
}
explosion.prototype = Object.create(gameObject.prototype);

function logo(x, y) {
  gameObject.call(this, x, y);
  this.x = canvas.width / 2 - this.image.width / 2;
  this.y = canvas.height / 2 - 200;
  this.zindex = 1000;
  this.draw = function () {
    if (!this.image.isLoaded == true) return;
    ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
  };
}

function heart(x, y) {
  gameObject.call(this, x, y);
  this.zindex = 2000;
  this.x = x;
  this.y = 100;
  this.draw = function () {
    if (!this.image.isLoaded == true) return;
    ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
  };
}

function soundBtn(x, y) {
  gameObject.call(this, x, y);
  this.zindex = 2000;
  this.x = canvas.width - this.image.width - 60;
  this.y = 50;
  this.max_width = this.x + this.image.width;
  this.max_height = this.y + this.image.height;
  this.muted = false;
  this.draw = function () {
    if (!this.image.isLoaded == true) return;
    if (this.muted) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
      ctx.restore();
    } else {
      ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
      ctx.globalAlpha = 1;
    }
  };
}

function start(x, y) {
  gameObject.call(this, x, y);
  this.zindex = 1000;
  this.x = canvas.width / 2 - this.image.width / 2;
  this.y = canvas.height / 2 + 80;
  this.max_width = this.x + this.image.width;
  this.max_height = this.y + this.image.height;
  this.draw = function () {
    if (!this.image.isLoaded == true) return;
    ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
  };
}

function gameOverBtn(x, y) {
  gameObject.call(this, x, y);
  this.zindex = 1000;
  this.x = canvas.width / 2 - this.image.width / 2;
  this.y = canvas.height / 2 - this.image.height / 2;
  this.max_width = this.x + this.image.width;
  this.max_height = this.y + this.image.height;
  this.draw = function () {
    if (!this.image.isLoaded == true) return;
    ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
  };
}

// util

// z-index ?????? ????????????
function compareZindex(a, b) {
  if (a.zindex < b.zindex) return -1;
  else return 1;
}

// ????????? ??? ??????
function getRandom(min, max) {
  return Math.floor(Math.random() * max + min);
}

// ?????? ??? ?????? ??????
function collisionArea(ob1, ob2) {
  const overX = Math.max(
    0,
    Math.min(ob1.x + ob1.getFrameWidth(), ob2.x + ob2.getFrameWidth()) - Math.max(ob1.x, ob2.x)
  );
  const overY = Math.max(
    0,
    Math.min(ob1.y + ob1.getFrameHeight(), ob2.y + ob2.getFrameHeight()) - Math.max(ob1.y, ob2.y)
  );

  return overX * overY;
}

// ????????? ?????? ????????? ????????? tbd ??????
function isTbd(ob) {
  if (
    ob.x + ob.image.width < 0 ||
    ob.x > canvas.width ||
    ob.y + ob.image.height < 0 ||
    ob.y > canvas.height
  ) {
    ob.tbd = true;
    return true;
  } else return false;
}

// tbd ?????? ??????
function purgeTbd(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i].tbd) {
      arr.splice(i, 1);
    }
  }
}

// ???????????? ??????
const canvas = document.getElementById('canvas');
const keyState = {};
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ????????? ?????? ?????????
canvas.addEventListener('click', function (e) {
  if (!myscene.started) {
    const start = myscene.start;

    // ???????????? ?????????
    if (
      start.x <= e.pageX &&
      e.pageX <= start.max_width &&
      start.y <= e.pageY &&
      e.pageY <= start.max_height
    ) {
      myscene.gameStart();
    }
  } else if (myscene.ship.isDead) {
    const gameOverBtn = myscene.gameOverBtn;

    // ?????????????????? ?????????
    if (
      gameOverBtn.x <= e.pageX &&
      e.pageX <= gameOverBtn.max_width &&
      gameOverBtn.max_height - 70 <= e.pageY &&
      e.pageY <= gameOverBtn.max_height
    ) {
      myscene.gameStart();
    }
  } else {
    const soundBtn = myscene.soundBtn;

    // ??????????????? ?????????
    if (
      soundBtn.x <= e.pageX &&
      e.pageX <= soundBtn.max_width &&
      soundBtn.y <= e.pageY &&
      e.pageY <= soundBtn.max_height
    ) {
      sound.muteEffect();
      sound.muteBg();
    }
  }
});

// ????????? ?????? ?????????
canvas.addEventListener('keydown', (e) => {
  keyState[e.key] = 'on';
  if (e.key == 'ArrowRight' || e.key == ' ') {
    myscene.ship.shootToEnemy();
  }
});

// ????????? ??? ?????????
canvas.addEventListener('keyup', (e) => {
  keyState[e.key] = undefined;
});

const ctx = canvas.getContext('2d');
const images = new imagesList();
const myscene = new scene();

myscene.init();
