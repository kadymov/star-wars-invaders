;var SGE = (function(SGE, window, undefined) {
    'use strict';

    SGE.Sprite = function(images) {
        SGE.Drawable.call(this);

        this._images = images;
        this._currentFrame = 0;
        this._fCount = (images && images.length) || 0;
    };

    var fn = SGE.Sprite.prototype = Object.create(SGE.Drawable.prototype);
    SGE.Sprite.prototype.constructor = SGE.Sprite;

    fn.draw = function (ctx, x, y) {
        if (!this.visibility()) return this;
        
        var img = this._images[this._currentFrame];

        ctx.drawImage(img, x + this._x, y + this._y);

        return this;
    };

    fn.width = function (w) {
        var img = this._images[this._currentFrame];

        if (!img) return 0;

        return img.width;
    };

    fn.height = function (h) {
        var img = this._images[this._currentFrame];

        if (!img) return 0;

        return img.height;
    };

    fn.addImage = function (image) {
        this._images.push(image);
        this._fCount++;
    };

    fn.goto = function (id) {
        if (id !== undefined && id >= 0 && id < this._fCount) {
            this._currentFrame = id;
        }
        return this;
    };

    fn.next = function () {
        var id = this._currentFrame;
        id = id + 1 < this._fCount ? id + 1 : 0;
        this._currentFrame = id;
        return this;
    };

    fn.prev = function () {
        var id = this._currentFrame;
        id = id - 1 >= 0 ? id - 1 : this._fCount - 1;
        this._currentFrame = id;
        return this;
    };

    fn.fCount = function () {
        return this._fCount;
    };

    fn.currentFrame = function () {
        return this._currentFrame;
    };

    return SGE;
})(SGE || {}, window);