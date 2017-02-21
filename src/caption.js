;var SGE = (function(SGE, window, undefined) {
    'use strict';

    SGE.Caption = function(text, color, align, baseline, font) {
        SGE.Drawable.call(this);
        this._text = text || '';
        this._color = color || 'white';
        this._font = font || '14pt Arial';
        this._align = align || 'start';
        this._baseline = baseline || 'top';
    };

    var fn = SGE.Caption.prototype = Object.create(SGE.Drawable.prototype);
    SGE.Caption.prototype.constructor = SGE.Caption;

    fn.draw = function (ctx, x, y) {
        if (!this.visibility()) return this;
        
        ctx.save();
        ctx.fillStyle = this._color;
        ctx.font      = this._font;
        ctx.textAlign = this._align;
        ctx.textBaseline = this._baseline;
        ctx.fillText(this._text, x + this._x, y + this._y);
        ctx.restore();

        return this;
    };
    
    fn.text = function (text) {
        if (!arguments.length) return this._text;
        this._text = text;
        return this;
    };

    fn.width = function (w) {

    };

    fn.height = function (h) {

    };

    

    return SGE;
})(SGE || {}, window);