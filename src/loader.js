;var SGE = (function(SGE, window, undefined) {
    'use strict';

    SGE.Loader = {};

    SGE.Loader.loadImages = function(imgUrlObj, onImagesLoaded, onProgress) {
        var result = {},
            resArr = [],
            count = 0,
            len = 0,
            urls;

        for (var name in imgUrlObj) {
            if (!imgUrlObj.hasOwnProperty(name)) continue;

            urls = imgUrlObj[name];

            urls = Array.isArray(urls) ? urls : [urls];

            resArr = [];
            urls.forEach(function(el) {
                var img = new Image();

                img.onload = function() {
                    if (++count === len && onImagesLoaded) onImagesLoaded(result);
                    if (onProgress) onProgress(count, len);
                };

                img.src = el;
                resArr.push(img);

                len++;
            });

            result[name] = resArr;
        }
    };

    return SGE;
})(SGE || {}, window);