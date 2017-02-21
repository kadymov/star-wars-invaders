;var Game = (function(Game, SGE, window, undefined) {
    'use strict';

    Game.Rocket = function(images, speedX, speedY, screenObj, onDestroy) {
        SGE.Sprite.call(this, images, 60, false);

        this._speedX = speedX || 0;
        this._speedY = speedY || 0;
        this._screenObj = screenObj;
        this._onDestroy = onDestroy || function(){};
        
        this._launched = false;
    };

    var fn = Game.Rocket.prototype = Object.create(SGE.Sprite.prototype);
    Game.Rocket.prototype.constructor = Game.Rocket;


    fn._update = function() {
        if (!this._launched) return;
        
        var r_speed = this._speed / 1000,
            r_x = this._x,
            r_y = this._y,
            t = (new Date().getTime() - this._lastDraw);
        
        
        r_x += this._speedX;
        r_y += this._speedY;        
        
        
        this._x = r_x;
        this._y = r_y;
        
        if (!this.test(this._screenObj)) {
            this._onDestroy();
        }        
            
        this._lastDraw = new Date().getTime();
    }
    
    fn.draw = function (ctx, x, y) {
        this._update();
        
        SGE.Sprite.prototype.draw.apply(this, arguments);
        
        return this;
    };
    
    fn.speedX = function(speed) {
        if (!arguments.length) return this._speedX;
        this._speedX = speed;
        return this;
    };
    
    fn.speedY = function(speed) {
        if (!arguments.length) return this._speedY;
        this._speedY = speed;
        return this;
    };
    
    
    fn.launch = function () {
        this._launched = true;
        return this;
    }; 

    return Game;
})(Game || {}, SGE, window);