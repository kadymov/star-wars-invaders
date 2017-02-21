;var SGE = (function(SGE, window, undefined) {
    'use strict';

    SGE.Voxel = function(bgImages, maskImages) {
        SGE.Sprite.call(this, bgImages);
        this._maskImages = maskImages;       
        
        this._canvBuffer = document.createElement('canvas');
        this._canvBuffer.width = 512;
        this._canvBuffer.height = 512;

        this._canvCtx = this._canvBuffer.getContext('2d');
    };

    var fn = SGE.Voxel.prototype = Object.create(SGE.Sprite.prototype);
    SGE.Voxel.prototype.constructor = SGE.Voxel;


    fn.draw = function (ctx, x, y) {
        var img = this._images[this._currentFrame],
            maskImg = this._maskImages[this._currentFrame],
            buffCtx = this._canvCtx;

        buffCtx.globalCompositeOperation = 'source-over';
        buffCtx.clearRect(0, 0, 512, 512);
        
        buffCtx.drawImage(maskImg, 0, 0);
        buffCtx.globalCompositeOperation = 'source-in';
        buffCtx.drawImage(img, 0, 0);

        ctx.drawImage(this._canvBuffer, x + this._x, y + this._y);
        
        return this;
    };
    
    fn.clearCircle = function(x, y, radius, frame) {
        frame = arguments.length > 3 ? frame : this._currentFrame;
        
        var maskImg = this._maskImages[frame],
            buffCanv = document.createElement('canvas'),
            buffCtx;
        
        buffCanv.width = 512;
        buffCanv.height = 512;
        buffCtx = buffCanv.getContext('2d');
                
        
        buffCtx.drawImage(maskImg, 0, 0);
        
        buffCtx.beginPath();
        buffCtx.arc(x, y, radius, 0, 2 * Math.PI, false);
        buffCtx.clip();
        buffCtx.clearRect(x - radius - 1, y - radius - 1,
                          radius * 2 + 2, radius * 2 + 2);
        
        this._maskImages[frame] = buffCanv;
    }

    return SGE;
})(SGE || {}, window);