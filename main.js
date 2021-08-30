'use strict';

const ENERGY = 5;
const BLACK_BIRD_HEIGHT = 135;
const JET_HEIGHT = 176;
const BULLET_HEIGHT = 36;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const jet = document.querySelector('.jet');
const windowwidth = window.innerWidth;


function imagesRepo(){
    this.ship = new Image();
    this.ship.src = "images/sprite.png";
}


// key event
window.addEventListener('keydown', (e) => {

    const up = parseInt(window.getComputedStyle(jet).getPropertyValue('top'));
    const y = fieldRect.height - JET_HEIGHT;

    // move jet
    if(e.key == 'ArrowUp' && up > 80){
        jet.style.top = up - 80 + 'px';
    }else if(e.key == 'ArrowDown' && up <= y){
        jet.style.top = up + 80 + 'px';
    }

    // shot bullet
    if(e.key == 'ArrowRight' || e.keyCode == 32) {
        const bullet = document.createElement('div');
        bullet.classList.add('bullet');
        field.appendChild(bullet);

        const movebullet = setInterval(() => {
            const birds = document.getElementsByClassName('bird');

            for(let i = 0; i < birds.length ; i++){
                const bird = birds[i];

                if(bird != undefined) {
                    const birdbound = bird.getBoundingClientRect();
                    const bulletbound = bullet.getBoundingClientRect();
                    
                    if(
                        bulletbound.top >= birdbound.top &&
                        bulletbound.bottom <= birdbound.bottom &&
                        bulletbound.right >= birdbound.left
                    ) {
                        bird.parentElement.removeChild(bird);
                        bullet.remove();
                        // scoreboard
                    }
                }
            }
            const bulletleft =  parseInt(window.getComputedStyle(bullet).getPropertyValue('left'));

            // stops the bullet from moving outside the gamevox
            if(bulletleft >= fieldRect.width){
                clearInterval(movebullet);
                bullet.remove();
            }
            bullet.style.top = up + JET_HEIGHT/2 + 'px'; // bullet should always be placed at the top of my jet
            bullet.style.left = bulletleft + 10 + 'px';
        });
    }

})

// create bird 
const generatoebirds = setInterval(() => {
    const bird = document.createElement('div');
    const birdtop = parseInt(window.getComputedStyle(bird).getPropertyValue('top'));
    
    bird.classList.add('bird');
    bird.style.top = Math.floor(Math.random() *  (fieldRect.height - BLACK_BIRD_HEIGHT)) + 'px';
    field.appendChild(bird);
},3000) 

// move birds
const movebirds = setInterval(() => {
    const birds = document.getElementsByClassName('bird');

    if(birds != undefined){
        for(let j=0; j< birds.length; j++){
            const bird = birds[j];
            const birdright = parseInt(window.getComputedStyle(bird).getPropertyValue("right"));

            if(birdright > windowwidth){
                bird.remove();
            }else{
                bird.style.right = birdright + 50 + 'px';
            }
        }
    }
},100)