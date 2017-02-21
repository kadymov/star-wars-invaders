;var Game = (function(Game, SGE, window, undefined) {
    'use strict';

    Game.Player = function(images, maxSpeed, minX, maxX) {
        SGE.Movie.call(this, images, 60, false);

        this._speed = 0;
        this._accelerationLeftValue = 0
        this._accelerationRightValue = 0
        this._lastDraw = new Date().getTime();
        this._maxSpeed = maxSpeed || 20;
        this._minX = minX || -100;
        this._maxX = maxX || 1024 + 100;
    };

    var fn = Game.Player.prototype = Object.create(SGE.Movie.prototype);
    Game.Player.prototype.constructor = Game.Player;


    fn._update = function() {
        var accelerationValue = 
                this._accelerationRightValue-
                    this._accelerationLeftValue,
            
            a_speed = accelerationValue / 1000,
            p_speed = this._speed,
            p_x = this._x,
            t = (new Date().getTime() - this._lastDraw),
            dVal = a_speed * t,
            resist = 0;
        
        if (p_speed < 0)
            resist = -10 / 1000 * t;
        else if (p_speed > 0) {
            resist = 10 / 1000 * t;
        }
        
        p_speed += dVal - resist;
        
        if (Math.abs(p_speed) < 0.1) {
            p_speed = 0;
        } else if (Math.abs(p_speed) > this._maxSpeed) {
            p_speed = p_speed < 0 ? -this._maxSpeed : this._maxSpeed;;
        }
        
        p_x += p_speed;
        
        
        if (p_x < this._minX) {
            p_x = this._maxX;
        } else if (p_x > this._maxX) {
            p_x = this._minX;
        }
        
        this._speed = p_speed;
        this._x = p_x;
            
        this._lastDraw = new Date().getTime();
    }
    
    fn.draw = function (ctx, x, y) {
        this._update();
        
        SGE.Movie.prototype.draw.apply(this, arguments);
        
        return this;
    };
    
    fn.accelerationLeft = function (accelerationValue) {
        this._accelerationLeftValue = accelerationValue || 0;
        return this;
    };
    
    fn.accelerationRight = function (accelerationValue) {
        this._accelerationRightValue = accelerationValue || 0;
        return this;
    };
    
    fn.fire = function () {
        this.play(true);
        return this;
    };    

    return Game;
})(Game || {}, SGE, window);