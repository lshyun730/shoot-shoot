# shoot-shoot
<br>

### ✔ Project Schedule
2021.08.28 - 2021.10.25
<br><br>

### ✔ Project Outline
방향키를 통해 캐릭터를 이동하여 다가오는 새를 쏘고 점수를 얻는 게임<br>
方向キーでキャラクターを移動させ、近づく鳥を撃って点数を得るゲーム<br>
Click [demo](https://lshyun730.github.io/shoot-shoot/)
<br><br>

### ✔ Technology Stack
Javascript
<br><br>

### ✔ Reference Site
#### Design Reference
- [duck hunt](https://www.silvergames.com/en/duck-hunt)
- [shootup](https://shootup.io/) (logo design)
<br>

<br><br>

### ✔ Requirement
- 방향키 위, 아래 이동 시 캐릭터 이동 / 方向キー移動時にキャラクター移動
- 스페이스바 누를 시 총알 날아간다 / スペースバーをクリックするとミサイル発射
- 새에게 데미지가 쌓여 죽을 시 포인트가 쌓인다 / 鳥にダメージがたまって死ぬとポイントがたまる
- 새와 3번 부딪히면 게임오버 / 鳥と3回ぶつかるとゲームオーバー
<br><br>

### ✔ Specificity
- 바닐라자바스크립트 만을 사용하여 코드를 작성했다 / バニラジャバスクリプトを利用してコードを作成した
- 이미지 정보가 저장된 메소드를 작성해 필요할때 객체를 생성하도록 하였다 (아래의 예시는 게임로고를 캔버스에 나타내는 부분이다)　/ イメージ情報が入っているメソッドを作成し、必要な時にオブジェクトを作れるようにした（以下は、ゲームのロゴをキャンバスに描く部分だ）
``` javascript
// 이미지 저장소
function imagesList(){
    this.logo = new Image();
    this.logo.src = "images/logo.png";
    this.heart.onload = function () { this.isLoaded = true;};

    this.getImageFor = function (item, enemyNum) {
        if(item instanceof logo) return this.logo;
    }
}

// 게임 오브젝트 생성
function gameObject(x, y, enemyNum) {
    this.x = x;
    this.y = y;
    this.image = images.getImageFor(this, enemyNum);
}

// 이미지 불러오기
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

// 게임 시작 버튼을 누를 시
scene.prototype.clickToStart=function(){
    new logo(0, 0).draw();
}

// 이미지리스트 객체 생성
const images = new imagesList();
```


<br><br>

### ✔ Areas for Improvement
- [x] 총알과 새들이 canvas 내에서 사라질시 gameItemList 에서도 삭제 / ミサイルと鳥が canvas 範囲になければ gameItems[] から削除
- [ ] 페이지를 벗어나고 다시 들어올 시 게임오버 되도록 구현하기 / ページを抜け出して再び入ってきた場合、ゲームオーバーになるようにする
- [ ] 다시시작 버튼 생성 / 再スタートボタン作成
- [ ] 점수가 저장이 되어 랭크로 볼수 있도록 구현 / 点数が保存され、ランクで見ることができるように実現
<br><br>

