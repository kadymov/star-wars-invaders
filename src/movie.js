;var SGE = (function(SGE, window, undefined) {
    'use strict';

    SGE.Movie = function(images, duration, isPlay) {
        SGE.Sprite.call(this, images);

        this._frame = 0;
        this._duration = duration || 100;
        this._lastTime = 0;
        
        this._isPlay = arguments.length > 2 ? isPlay : true;
        this._once = false;
    };

    var fn = SGE.Movie.prototype = Object.create(SGE.Sprite.prototype);
    SGE.Movie.prototype.constructor = SGE.Movie;


    fn._step = function() {
        if (!this._isPlay) return;
        
        var now = new Date().getTime(),
            dt = now - (this._lastTime || now),
            frame = this._frame, f;

        this._lastTime = now;

        f = frame + dt / this._duration;

        if (this._once && this.currentFrame() === this.fCount() - 1) {
            this.stop();
            this.goto(0);
            return;
        }
        
        if (parseInt(f) > frame) this.next();

        this._frame = f;
    };


    fn.draw = function (ctx, x, y) {
        if (!this.visibility()) return;
        
        var img = this._images[this._currentFrame];

        this._step();

        ctx.drawImage(img, x + this._x, y + this._y);

        return this;
    };
    
    fn.stop = function() {
        this._isPlay = false;
    };
    
    fn.play = function(once, start) {
        this._isPlay = true;
        this._once = !!once;
        if (arguments.length > 1) {
            this.goto(start || 0);
        }
    };

    return SGE;
})(SGE || {}, window);