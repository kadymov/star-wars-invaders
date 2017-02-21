;var Game = (function(Game, SGE, window, undefined) {
    'use strict';

     Game.EnemiesLayer = function(enemySprite, screen, eventsCallback) {
         SGE.Layer.call(this);

         this._screen = screen;
         this._eventsCallback = eventsCallback || function() {};
         
         this._init(enemySprite, screen);
         
         this.x(screen.width() / 2 - 30 * 6 / 2);
         this.y(50);
         
         this._lastDraw = new Date().getTime();
         this._moveDirection = 'right';
         this._hspeed = 150;
         this._vspeed = 10;
         this._level = 1;
     };

    var fn = Game.EnemiesLayer.prototype = Object.create(SGE.Layer.prototype);
    Game.EnemiesLayer.prototype.constructor = Game.EnemiesLayer;


    fn._init = function(enemySprite, screen) {
        var i, j, enemy,
            H_SPACE = 40,
            V_SPACE = 40;
        
        for (j = 0; j < 5; j++) {
            for (i = 0; i < 6; i++) {
                enemy = new SGE.Movie(enemySprite, 20, false);
                this.add(enemy, i * H_SPACE, j * V_SPACE);
            }
        }
    };
    
    fn.draw = function(ctx, x, y) {
        if (!this.visibility()) return this;
        
        var t = new Date().getTime() - this._lastDraw,
            hVal = this._hspeed * this._level / 1000 * t,
            vVal = this._vspeed * this._level / 1000 * t;
        
        if (this._x < 0) {
            this._moveDirection = 'right';
        } else if (this._x > this._screen.width() - 6 * 40) {
            this._moveDirection = 'left';
        }
        
        hVal = this._moveDirection === 'right' ? hVal : -hVal;
        this._x += hVal;
        this._y += vVal;
        
        if (this.y() + this.height() >= this._screen.height() - 120) {
            this._eventsCallback({event : 'gameover'});
        }        
        
        SGE.Layer.prototype.draw.apply(this, arguments);
        
        this._lastDraw = new Date().getTime();
    };
    
    fn.level = function(level) {
        if (!arguments.length) return this._level;
        this._level = level;
        return this;
    };
    

    return Game;
})(Game || {}, SGE, window);