;var SGE = (function(SGE, window, undefined) {
    'use strict';

    SGE.Drawable = function() {
        if (this.constructor === SGE.Drawable) 
            throw new Error('This is abstract class');

        this._x = 0;
        this._y = 0;
        this._z = 0;
        this._width = 0;
        this._height = 0;
        this._parent = null;
        this._visibility = true;
    };


    var fn = SGE.Drawable.prototype;

    fn.draw = function (ctx) {
        if (!this.visibility()) return this;
        // ...
    };

    fn.x = function (x) {
        if (!arguments.length) return this._x;
        this._x = x;
        return this;
    };

    fn.y = function (y) {
        if (!arguments.length) return this._y;
        this._y = y;
        return this;
    };

    fn.z = function (z) {
        if (!arguments.length) return this._z;
        this._z = z;
        return this;
    };
    
    fn.getRect = function() {
        var parent = this._parent,
            parentRect = parent ? parent.getRect() : 
                { top : 0,  left : 0, bottom : 0, right: 0};
        
        return {
            left : parentRect.left + this.x(),
            top : parentRect.top + this.y(),
            right : parentRect.left + this.x() + this.width(),
            bottom : parentRect.top + this.y() + this.height(),
        };
    };

    fn.width = function (width) {
        if (!arguments.length) return this._width;
        this._width = width;
        return this;
    };

    fn.height = function (height) {
        if (!arguments.length) return this._height;
        this._height = height;
        return this;
    };
    
    fn.parent = function (p) {
        if (!arguments.length) return this._parent;
        this._parent = p;
        return this;
    };
    
    fn.visibility = function(v) {
        if (!arguments.length) return this._visibility;
        this._visibility = v;
        return this;
    };
    
    fn.test = function (drawable) {
        if (!drawable) return false;
        
        var r1 = this.getRect(),
            r2 = drawable.getRect();
        
        return r1.left < r2.right &&
               r1.right > r2.left &&
               r1.top < r2.bottom &&
               r1.bottom > r2.top;
    };

    return SGE;
})(SGE || {}, window);