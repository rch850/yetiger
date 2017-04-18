/// <reference path="typings/phaser.d.ts"/>

const CALLS = ['フワフワフワフワ', 'はーいはーいはいはいはいはい', 'おーーーっはい', 'フッフー'];

class Title extends Phaser.State {

    create() {
        this.stage.backgroundColor = '#4a8011';

        const titleStyle = {fontSize: '20pt', fill: '#fff'};
        const textStyle = {fontSize: '12pt', fill: '#fff'};
        this.add.text(10, 100, "イェッタイガーゲーム", titleStyle);
        this.add.text(10, 200, "方向キーでタイガーを操作して\nイェッに帰そう。\n\n" +
            "飛んでくる文字に当たるとゲームオーバー\n\n" +
            "エンターかタップでスタート", textStyle);
    }

    update() {
        if (this.input.keyboard.isDown(Phaser.KeyCode.ENTER) ||
                this.input.activePointer.isDown) {
            this.state.start('MainGame');
        }
    }

}

class MainGame extends Phaser.State {

    player: Phaser.Sprite;
    ie: Phaser.Sprite;
    calls: Phaser.Group;
    lives: Phaser.Sprite[];
    score = 0;
    scoreText: Phaser.Text;

    cursors: Phaser.CursorKeys;

    preload() {
        this.load.image('ie', 'ie.png');
        this.load.image('tiger', 'tiger.png');
    }

    create() {

        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.ie = this.add.sprite(160, 480-80, 'ie');
        this.ie.width = this.ie.height = 80;
        this.ie.anchor.set(0.5);

        this.calls = this.add.physicsGroup();

        var y = 80;
        for (let i = 0; i < 5; i++) {
            this.addCall(this.world.randomX, y);
            y += 60;
        }

        this.player = this.add.sprite(160, 20, 'tiger');
        this.player.width = this.player.height = 40;
        this.player.anchor.set(0.5);

        this.lives = [];
        for (let i = 0; i < 3; i++) {
            let life = this.add.sprite(240 + 25 * i, 40, 'tiger');
            life.width = life.height = 20;
            this.lives.push(life);
        }

        this.scoreText = this.add.text(0, 0, this.score + " タイガー", {fontSize: '14pt', fill: '#fff', boundsAlignH: 'right'});
        this.scoreText.setTextBounds(200, 10, 110);

        this.physics.arcade.enable(this.player);

        this.cursors = this.input.keyboard.createCursorKeys();

    }

    update() {

        if (this.physics.arcade.distanceBetween(this.player, this.ie) <= 20) {
            // clear
            this.addCall(320, this.rnd.between(80, 320));
            this.player.x = 160;
            this.player.y = 20;
            this.score++;
            this.scoreText.text = this.score + " タイガー";
        }

        this.calls.forEach(this.loopCall, this);

        this.physics.arcade.overlap(this.player, this.calls, this.collisionHandler, null, this);

        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

        const pointerDir = this.getPointerDirection();

        if (this.cursors.left.isDown || pointerDir.left) {
            this.player.body.velocity.x = -100;
        } else if (this.cursors.right.isDown || pointerDir.right) {
            this.player.body.velocity.x = 100;
        }

        if (this.cursors.up.isDown || pointerDir.up) {
            this.player.body.velocity.y = -100;
        } else if (this.cursors.down.isDown || pointerDir.down) {
            this.player.body.velocity.y = 100;
        }
    }

    loopCall(call) {
        if (call.x < -call.width) {
            call.x = 320;
        }
    }

    collisionHandler(player, call) {
        player.x = 160;
        player.y = 20;

        this.lives.shift().destroy();
        if (this.lives.length <= 0) {
            // game over
            this.state.start('Title');
        }
    }

    addCall(x: number, y: number) {
        var fwfw = this.add.text(x, y, this.rnd.pick(CALLS), {fontSize: '12pt', fill: '#FFFFFF'}, this.calls);
        fwfw.body.velocity.x = this.rnd.between(-50, -150);
        // make physics body smaller than text.
        fwfw.body.setSize(fwfw.width - 40, fwfw.height - 40, 20, 20);
    }

    getPointerDirection() {
        const dx = this.input.activePointer.x - this.player.x;
        const dy = this.input.activePointer.y - this.player.y;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        const isDown = this.input.activePointer.isDown;
        return {
            left: isDown && (angle >= 120 || angle <= -120),
            right: isDown && (-60 <= angle && angle <= 60),
            down: isDown && (30 <= angle && angle <= 150),
            up: isDown && (-150 <= angle && angle <= -30)
        };
    }
}

window.onload = function() {
    const game = new Phaser.Game(320, 480, Phaser.CANVAS, 'phaser-example');
    game.state.add('Title', Title);
    game.state.add('MainGame', MainGame);
    game.state.start('Title');
};
