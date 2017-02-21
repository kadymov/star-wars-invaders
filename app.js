(function(SGE, window) {
    'use strict';
    
    
    var requestAnimationFrame = window.requestAnimationFrame || 
        window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
    
    /**************************************************************************/
    
    document.addEventListener('DOMContentLoaded', function () {
        SGE.Loader.loadImages({
            background : 'img/bg.png',
            overflow : 'img/overflow.png',
            player :    ['img/player.png', 'img/player.png', 'img/player.png'],
            enemy  :    ['img/enemy.png', 'img/enemy.png', 'img/enemy.png'],
            rocket :     'img/rocket.png',
            bunker :     'img/bunker.png',
            bunkerMask : 'img/bunker_mask.png',
        }, init);
    });
    
    function init(imagesManager) {
        var 
            SCR_WIDTH = 405,
            SCR_HEIGHT = 720,
            gameIsRunning = true,
            
            screen = new SGE.Screen(SCR_WIDTH, SCR_HEIGHT, true)
                            .appendTo(document.body),
            
            // Game Elements
            player = new Game.Player(imagesManager.player, 
                                     50, -100, SCR_WIDTH + 100),
            background = new SGE.Sprite(imagesManager.background),
            overflow = new SGE.Sprite(imagesManager.overflow),
            
            livesIcon = new SGE.Sprite(imagesManager.player),
            gameStatusCaption = new SGE.Caption('You WIN!', 'white', 'center'),
            numberOfLivesCaption = new SGE.Caption('3', 'white', 'start', 'middle'),
            
            // Layers
            playerLayer = new SGE.Layer(),
            backgroundLayer = new SGE.Layer(),
            enemiesLayer = new Game.EnemiesLayer(imagesManager.enemy, screen, onEvent),
            rocketsLayer = new Game.RocketsLayer(imagesManager.rocket, 
                                                 20, screen, enemiesLayer, player, onEvent),
            uiLayer = new SGE.Layer(),
            
            numberOfLives = 3,
            shakeScreenCount = 0;
        
        // ----------
        
        screen.add(backgroundLayer.add(background))
            .add(rocketsLayer)
            .add(playerLayer.add(player, 
                                 SCR_WIDTH / 2 - player.width() / 2, 
                                 SCR_HEIGHT - player.height() - 80))
            .add(enemiesLayer, 0, 100)
            .add(uiLayer
                 .add(livesIcon, 10, screen.height() - 60)
                 .add(numberOfLivesCaption, 
                      livesIcon.x() + livesIcon.width() + 10, screen.height() - 30)
                 .add(overflow)
                 .add(gameStatusCaption, screen.width() / 2, screen.height() / 2)
                );
        
        
        overflow.visibility(false);
        gameStatusCaption.visibility(false);

        // Events -------------------------------------------------------------
        
        var fire = false;
        document.addEventListener('keydown', function(e) {
            if (e.keyCode === 37) player.accelerationLeft(50);
            if (e.keyCode === 39) player.accelerationRight(50);
            if (e.keyCode === 32) {
                fire = true;
            }
        });
        document.addEventListener('keyup', function(e) {
            if (e.keyCode === 37) player.accelerationLeft(0);
            if (e.keyCode === 39) player.accelerationRight(0);
            if (e.keyCode === 32) {
                fire = false;
            }
        });
        
        // Touch events
        (function() {
            var canvas = screen.getCanvas(),
                touchStartX = 0,
                maxDiff = window.innerWidth / 3;
            
            canvas.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].pageX;
                fire = true;
            });
            
            canvas.addEventListener("touchmove", function(e) {
                var touchX = e.changedTouches[0].pageX,
                    diff = Math.abs(touchStartX - touchX);
                
                if (touchStartX < touchX) {
                    player.accelerationRight(Math.min(50, 50 * diff / maxDiff));
                } else {
                    player.accelerationLeft(Math.min(50, 50 * diff / maxDiff));
                }
            }, false);
            
            canvas.addEventListener('touchend', function(e) {
                fire = false;
                
                player.accelerationLeft(0);
                player.accelerationRight(0);
            });
        })();
                
        // Render -------------------------------------------------------------
        
        (function render() {
            if (gameIsRunning) {
                step();
                screen.draw();
            }
            requestAnimationFrame(render);
        })();
        
        // --------------------------------------------------------------------
        
        var launch = (function() {
            var lastShot = new Date().getTime();
            return function() {
                if (new Date().getTime() - lastShot < 300) return;
                
                player.fire();
                rocketsLayer.launch(player.x() + player.width() / 2, 
                                    player.y() - 30);
                
                lastShot = new Date().getTime();
            }
        })();
        
        function shakeScreen() {
            if (!shakeScreenCount) {
                screen.x(0).y(0);
                return;
            }
            shakeScreenCount--;
            
            screen.x(Math.random() * 20 - 10)
                  .y(Math.random() * 20 - 10);
            
        }
        
        function step() {
            if (fire) launch();
            shakeScreen();
        }
        
        // Game Events --------------------------------------------------------
        
        function onEvent(e) {
            switch (e.event) {
                case 'enemyDestroyed':
                    enemiesLayer.level(enemiesLayer.level() + 0.1);
                    break;
                case 'damage':
                    numberOfLives--;
                    shakeScreenCount = 10;
                    numberOfLivesCaption.text(numberOfLives);
                    if (!numberOfLives) onEvent({event:'gameover'});
                    break;
                case 'won':
                    gameIsRunning = false;
                    overflow.visibility(true);
                    gameStatusCaption.text('You WIN!').visibility(true);
                    break;
                case 'gameover':
                    gameIsRunning = false;
                    overflow.visibility(true);
                    gameStatusCaption.text('Game Over').visibility(true);
                    break;
            }
        }
    }
})(SGE, window);