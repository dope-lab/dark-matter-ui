var base = (function($, window, document, undefined) {
  'use strict';

  var scrollTo = function ($el) {
    $('html, body').animate({ scrollTop: $el.offset().top}, 1000);
  }

  var parallaxText = function ($elem) {
    var tmp = $($elem).css('text-shadow').match(/(-?\d+px)|(rgb\(.+\))/g)
    var color = tmp[0],
    y = tmp[1].match(/\d+/),
    x = tmp[2].match(/\d+/),
    blur = tmp[3];

    $('body').mousemove( function(e) {
        var _w = window.innerWidth/2;
        var _h = window.innerHeight/2;
        var _mouseX = e.clientX;
        var _mouseY = e.clientY;
        var _depthX = x - (_mouseX - _w) * 0.01 + 'px';
        var _depthY =  y - (_mouseY - _h) * 0.02 + 'px'
        var prop = _depthX + ' ' +  _depthY + ' ' + blur + ' ' + color;
        $($elem).css('textShadow',prop);
    })
  }

  var polyfills = function () {
    // https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
    if (!String.prototype.padStart) {
      String.prototype.padStart = function padStart(targetLength, padString) {
          targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
          padString = String(typeof padString !== 'undefined' ? padString : ' ');
          if (this.length >= targetLength) {
              return String(this);
          } else {
              targetLength = targetLength - this.length;
              if (targetLength > padString.length) {
                  padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
              }
              return padString.slice(0, targetLength) + String(this);
          }
      };
    }
  }

  return {
    init: function () {
      polyfills();
      parallaxText('#text__p');
    },

    queue: function (module) {
      $(document).ready(function () {
        module.init();
      });
    },

    scrollTo: function ($el) {
      return scrollTo($el);
    },

  }
})(jQuery, window, document);
base.queue(base);
