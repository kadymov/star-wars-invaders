;var SGE = (function(SGE, window, undefined) {
    'use strict';

    SGE.Screen = function(width, height, showFPC) {
        SGE.Layer.call(this);

        this._width = width;
        this._height = height;

        var canvas = this._canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        this._ctx = canvas.getContext('2d');
        
        this._showFPC = !!showFPC;
        this._lastDraw = new Date();
        this._fpc = 0;
        this._lastFpcUpd = new Date();
    };

    var fn = SGE.Screen.prototype;

    var fn = SGE.Screen.prototype = Object.create(SGE.Layer.prototype);
    SGE.Screen.prototype.constructor = Screen;

    fn.appendTo = function (contaner) {
        contaner.appendChild(this._canvas);

        return this;
    };

    fn.draw = function () {
        var children = this._children,
            ctx = this._ctx;

        ctx.fillRect(0, 0, this._width, this._height);

        for (var i = 0, len = children.length; i < len; i++) {
            children[i].draw(ctx, this.x(), this.y());
        }
        
        if (this._showFPC) {
            this._drawFpc();
        }
        
        return this;
    };

    fn.parent = function () {
        return null;
    };
    
    fn._drawFpc = function() {
        var ctx = this._ctx,
            now = new Date().getTime(),
            delta = (now - this._lastDraw)/1000;
        
        this._lastDraw = now;
        
        
        if ((now - this._lastFpcUpd > 500)) {
            this._lastFpcUpd = now;
            this._fpc = Math.round(1 / delta);
        }
        
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font      = '14pt Arial';
        ctx.textBaseline = 'top';
        ctx.fillText('FPC: ' + this._fpc, 10, 10);
        ctx.restore();
    }
    
    fn.width = function() {
        return this._width;
    };
    
    fn.height = function() {
        return this._height;
    };
    
    fn.getCanvas = function() {
        return this._canvas;
    };

    return SGE;
})(SGE || {}, window);