window.onload = function() {

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example',
        { preload: preload, create: create, update: update });

    var player, ie, calls;
    var cursors;

    var CALLS = ['フワフワフワフワ', 'はーいはーいはいはいはいはい', 'おーーーっはい', 'フッフー'];

    function preload() {
        game.load.image('ie', 'ie.png');
        game.load.image('tiger', 'tiger.png');
    }

    function create() {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.backgroundColor = '#2d2d2d';

        ie = game.add.sprite(400, 600-80, 'ie');
        ie.anchor.set(0.5);

        calls = game.add.physicsGroup();

        var y = 80;

        for (var i = 0; i < 9; i++) {
            var fwfw = game.add.text(game.world.randomX, y, game.rnd.pick(CALLS), {fill: '#FFFFFF'}, calls);
            fwfw.body.velocity.x = game.rnd.between(100, 300);
            y += 48;
        }

        player = game.add.sprite(400, 32, 'tiger');
        player.width = player.height = 80;
        player.anchor.set(0.5);

        game.physics.arcade.enable(player);

        cursors = game.input.keyboard.createCursorKeys();

    }

    function update() {

        if (game.physics.arcade.distanceBetween(player, ie) <= 50) {
            // clear
            var fwfw = game.add.text(game.world.randomX, game.rnd.between(80, 334), game.rnd.pick(CALLS), {fill: '#FFFFFF'}, calls);
            fwfw.body.velocity.x = game.rnd.between(100, 300);
            player.x = 400;
            player.y = 32;
        }

        calls.forEach(loopCall, this);

        game.physics.arcade.overlap(player, calls, collisionHandler, null, this);

        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        if (cursors.left.isDown) {
            player.body.velocity.x = -200;
        } else if (cursors.right.isDown) {
            player.body.velocity.x = 200;
        }

        if (cursors.up.isDown) {
            player.body.velocity.y = -200;
        } else if (cursors.down.isDown) {
            player.body.velocity.y = 200;
        }
    }

    function loopCall (call) {
        if (call.x > 800) {
            call.x = -call.width;
        }
    }

    function collisionHandler (player, call) {
        player.x = 400;
        player.y = 32;
    }
};