const shootSound = new Audio('sound/shoot.mp3');
const attackSound = new Audio('sound/attack.mp3');
const explodeSound = new Audio('sound/explode.mp3');
const bgSound = new Audio('sound/bg.mp3');
const gameOverSound= new Audio('sound/gameOver.mp3');

export function playShoot() {
    playSound(shootSound);
}

export function playAttack() {
    playSound(attackSound);
}

export function playExplode() {
    playSound(explodeSound);
}

export function playBg() {
    playSound(bgSound);
}

export function stopBg() {
    stopSound(bgSound);
}

export function playGameOver() {
    playSound(gameOverSound);
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function stopSound(sound) {
    sound.pause();
}