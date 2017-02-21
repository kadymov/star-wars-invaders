;var SGE = (function(SGE, window, undefined) {
    'use strict';

     SGE.Layer = function() {
         SGE.Drawable.call(this);
         this._children = [];
     };

    var fn = SGE.Layer.prototype = Object.create(SGE.Drawable.prototype);
    SGE.Layer.prototype.constructor = SGE.Layer;


    fn.draw = function (ctx, x, y) {
        if (!this.visibility()) return this;
        
        var children = this._children,
            x = x + this._x,
            y = y + this._y;
        for (var i = 0, len = children.length; i < len; i++) {
            if (children[i]) {
                children[i].draw(ctx, x, y);
            }
        }

        return this;
    };

    fn.children = function () {
        return this._children;
    };

    fn.empty = function () {
        this._children = [];
        return this;
    };

    fn.add = function (child, x, y, z) {
        this._children.push(child);

        child.parent(this);

        if (x !== undefined) child.x(x);
        if (y !== undefined) child.y(y);
        if (z !== undefined) {
            child.z(z);
            this._children.sort(function(a, b) {
                return a.z() - b.z();
            });
        }

        return this;
    };

    fn.remove = function (child) {
        var children = this._children,
            id = children.indexOf(child);

        if (id >= 0) {
            children.splice(id, 1);
        }

        return this;
    };
    
    fn.has = function (child) {
        return this._children.indexOf(child) !== -1;
    };
    
    fn.children = function () {
        return this._children;
    };
    
    fn.width = function() {
        var ch = this.children(),
            i, len, child,
            maxVal = 0,
            val = 0;
        
        for (i = 0, len = ch.length; i < len; i++) {
            child = ch[i];
            val = child.x() + child.width();
            if (maxVal < val) maxVal = val;
        }
        
        return maxVal;
    };
    
    fn.height = function() {
        var ch = this.children(),
            i, len, child,
            maxVal = 0,
            val = 0;
        
        for (i = 0, len = ch.length; i < len; i++) {
            child = ch[i];
            val = child.y() + child.height();
            if (maxVal < val) maxVal = val;
        }
        
        return maxVal;
    };


    return SGE;
})(SGE || {}, window);