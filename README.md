# [shoot-shoot](https://lshyun730.github.io/shoot-shoot/)

<br>

### ✔ Project Schedule

2021.08.28 - 2021.10.25
<br><br>

### ✔ Project Outline

Neat and challenging shooter game. Arrows to move up and down, space to shoot.
<br>

⭐ Demo

<a href = "https://lshyun730.github.io/shoot-shoot/"><img alt="GitHub" src ="https://img.shields.io/badge/GitHub-181717.svg?&style=for-the-badge&logo=GitHub&logoColor=white"/>
</a>


⭐ Description

<a href = "https://drive.google.com/file/d/1eOE-lj2VxBPfoBy2XPr5744gL_LK-NKS/view"><img alt="GitHub" src ="https://img.shields.io/badge/Japanese-B7472A.svg?&style=for-the-badge&logo=Microsoft PowerPoint&logoColor=white"/>
</a>
<br><br>

### ✔ Technology Stack

Design - AdobeXd, Adobe Photoshop, Adobe illustrator <br>
Programming Language - Javascript

<br><br>

### ✔ Requirement

- arrows to move up and down
- every enemy has it’s own behavior
- press the spacebar, space to shoot
- bump into a bird three times, game over
- When a bird is damaged to death, gets point

  <br><br>

### ✔ How To Play

![How to play](https://user-images.githubusercontent.com/48264855/176650786-eb59af14-8811-4f80-9232-212145ca03d9.png)

  <br><br>

### ✔ Areas for Improvement

- [x] bullets and birds disappear from the canvas, delete them from the gameItemList (2022.04.10)
- [x] fix framed out (2022.04.10)
- [x] Create Restart Button (2022.06.26)
- [x] Save high score (2022.06.05)
- [x] Mute sound effect (2022.06.25)
- [ ] game over when out of page

<br><br>

### ✔ Specificity

- inheritance using Prototype Instead of Class
- coded as Vanilla JavaScript
- image repository constructor function was created to create an image instance

```javascript
// image repository
function imagesList() {
  this.logo = new Image();
  this.logo.src = 'images/logo.png';
  this.heart.onload = function () {
    this.isLoaded = true;
  };

  this.getImageFor = function (item, enemyNum) {
    if (item instanceof logo) return this.logo;
  };
}

// create game object
function gameObject(x, y, enemyNum) {
  this.x = x;
  this.y = y;
  this.image = images.getImageFor(this, enemyNum);
}

// create logo image object
function logo(x, y) {
  gameObject.call(this, x, y);
  this.x = canvas.width / 2 - this.image.width / 2;
  this.y = canvas.height / 2 - 250;
  this.zindex = 1000;
  this.draw = function () {
    if (!this.image.isLoaded == true) return;
    ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
  };
}

// click the start game button
scene.prototype.clickToStart = function () {
  new logo(0, 0).draw();
};

// create image list construction function
const images = new imagesList();
```

<br><br>

### ✔ Reference Site

#### Images Reference

- [background image](https://kr.freepik.com/free-vector/adventure-background_16921968.htm)
- [ship image](https://www.freepik.com/free-vector/astronaut-riding-rocket-cartoon-vector-icon-illustration-science-technology-icon-concept-isolated-premium-vector-flat-cartoon-style_17303379.htm#page=2&query=astronaut%20space%20rocket&position=23&from_view=search)
- [bird image](https://www.freepik.com/free-vector/kawaii-birds-collection_4320275.htm#&position=3&from_view=undefined#position=1)

<br>

#### Design Reference

- [duck hunt](https://www.silvergames.com/en/duck-hunt)
- [shootup](https://shootup.io/) (logo design)

<br>
<br>
