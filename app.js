/// <reference path="typings/phaser.d.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CALLS = ['フワフワフワフワ', 'はーいはーいはいはいはいはい', 'おーーーっはい', 'フッフー'];
var Title = (function (_super) {
    __extends(Title, _super);
    function Title() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Title.prototype.create = function () {
        this.add.text(100, 100, "イェッタイガーゲーム", { fill: '#fff' });
        this.add.text(100, 200, "方向キーでタイガーを操作してイェッに帰そう", { fill: '#fff' });
        this.add.text(100, 250, "飛んでくる文字に当たるとゲームオーバー", { fill: '#fff' });
        this.add.text(100, 300, "エンターでスタート", { fill: '#fff' });
    };
    Title.prototype.update = function () {
        if (this.input.keyboard.isDown(Phaser.KeyCode.ENTER)) {
            this.state.start('MainGame');
        }
    };
    return Title;
}(Phaser.State));
var MainGame = (function (_super) {
    __extends(MainGame, _super);
    function MainGame() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainGame.prototype.preload = function () {
        this.load.image('ie', 'ie.png');
        this.load.image('tiger', 'tiger.png');
    };
    MainGame.prototype.create = function () {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.stage.backgroundColor = '#2d2d2d';
        this.ie = this.add.sprite(400, 600 - 80, 'ie');
        this.ie.anchor.set(0.5);
        this.calls = this.add.physicsGroup();
        var y = 80;
        for (var i = 0; i < 9; i++) {
            this.addCall(y);
            y += 48;
        }
        this.player = this.add.sprite(400, 32, 'tiger');
        this.player.width = this.player.height = 80;
        this.player.anchor.set(0.5);
        this.physics.arcade.enable(this.player);
        this.cursors = this.input.keyboard.createCursorKeys();
    };
    MainGame.prototype.update = function () {
        if (this.physics.arcade.distanceBetween(this.player, this.ie) <= 50) {
            // clear
            this.addCall(this.rnd.between(80, 334));
            this.player.x = 400;
            this.player.y = 32;
        }
        this.calls.forEach(this.loopCall, this);
        this.physics.arcade.overlap(this.player, this.calls, this.collisionHandler, null, this);
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -200;
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 200;
        }
        if (this.cursors.up.isDown) {
            this.player.body.velocity.y = -200;
        }
        else if (this.cursors.down.isDown) {
            this.player.body.velocity.y = 200;
        }
    };
    MainGame.prototype.loopCall = function (call) {
        if (call.x < -call.width) {
            call.x = 800;
        }
    };
    MainGame.prototype.collisionHandler = function (player, call) {
        player.x = 400;
        player.y = 32;
    };
    MainGame.prototype.addCall = function (y) {
        var fwfw = this.add.text(this.world.randomX, y, this.rnd.pick(CALLS), { fill: '#FFFFFF' }, this.calls);
        fwfw.body.velocity.x = this.rnd.between(-100, -300);
        // make physics body smaller than text.
        fwfw.body.setSize(fwfw.width - 40, fwfw.height - 40, 20, 20);
    };
    return MainGame;
}(Phaser.State));
window.onload = function () {
    var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', Title);
    game.state.add('MainGame', MainGame);
};
//# sourceMappingURL=app.js.map