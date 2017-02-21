;var Game = (function(Game, SGE, window, undefined) {
    'use strict';

     Game.RocketsLayer = function(rocketSprite, bufferSize, 
                                   screen, enemiesLayer, player, eventsCallback) {
         SGE.Layer.call(this);

         this._rocketsBuffer = [];
         this._screen = screen;
         this._enemiesLayer = enemiesLayer;
         this._player = player;
         this._eventsCallback = eventsCallback || function() {};
         
         this._lastEnemyesShot = new Date().getTime();
         
         this._init(rocketSprite, bufferSize, screen);
     };

    var fn = Game.RocketsLayer.prototype = Object.create(SGE.Layer.prototype);
    Game.RocketsLayer.prototype.constructor = Game.RocketsLayer;


    fn._init = function(rocketSprite, bufferSize, screen) {
        var buff = this._rocketsBuffer,
            self = this,
            i, rocket;
        
        for (i = 0; i < bufferSize; i++) {
            (function(i) {
                rocket = new Game.Rocket(rocketSprite, 0, -20, screen,
                                         self._onDestroy.bind(self, i));
                buff.push(rocket);
            })(i);
        }
    };
    
    fn._checkCollision = function(rocket) {
        var enemiesLayer = this._enemiesLayer,
            enemies = enemiesLayer.children(),
            i, len, enemy;
        
        for (i = 0, len = enemies.length; i < len; i++) {
            enemy = enemies[i];
            if (enemy.test(rocket)) {
                return enemy;
            }
        }
    };
    
    fn.draw = function(ctx, x, y) {
        if (!this.visibility()) return this;
        
        var rockets = this.children(),
            i, len, rocket, target;
        
        for (i = 0, len = rockets.length; i < len; i++) {
            rocket = rockets[i];
            target = this._checkCollision(rocket);
            if (target) {
                this._enemiesLayer.remove(target);
                this.remove(rocket);
                            
                this._eventsCallback({event : 'enemyDestroyed'});
                if (!this._enemiesLayer.children().length) {
                    this._eventsCallback({event : 'won'});
                }
            }
            
            if (this._player.test(rocket)) {
                this._eventsCallback({event : 'damage'});
                this.remove(rocket);
            }
        }

        
        this._enemyesShot();
        
        SGE.Layer.prototype.draw.apply(this, arguments);
    };
    
    fn._onDestroy = function(i) { 
        var rocket = this._rocketsBuffer[i];
        this.remove(rocket);
        rocket.x(0);
        rocket.y(this._screen.height());
    };
    
    fn.launch = function(x, y, enemyShot) {
        var buffer = this._rocketsBuffer,
            bufferLen = buffer.length,
            rocket, i;
        
        for (i = 0; i < bufferLen; i++) {
            rocket = buffer[i];
            if (!this.has(rocket)) {
                rocket.speedY(enemyShot ? 5 : -20);
                
                this.add(rocket, x - rocket.width() / 2, y);
                
                rocket.launch();
                break;
            }
        }
        return this;
    };
    
    fn._enemyesShot = function() {
        if (new Date().getTime() - 
            this._lastEnemyesShot < 2000) return;
        
        this.launch(this._player.x() + this._player.width() / 2, 
                    this._enemiesLayer.getRect().bottom, true);
        
        this._lastEnemyesShot = new Date().getTime();
    }

    return Game;
})(Game || {}, SGE, window);