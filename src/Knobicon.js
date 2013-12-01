(function() {

  Knobicon = function(knobImgSrc, pointerImgSrc, options) {
    if (arguments.length < 2 || 
        typeof knobImgSrc !== 'string' ||
        typeof pointerImgSrc !== 'string')
      throw new Error("Missing/invalid required argument");

    this.context = document.createElement('canvas').getContext('2d');
    
    this.pointer = loadImg(pointerImgSrc);
    this.knob    = loadImg(knobImgSrc);

    if (options) {
      this.width  = typeof options.width !== 'undefined' ? options.width : undefined;
      this.height = typeof options.height !== 'undefined' ? options.height : undefined;
    }

    setCanvasSize.apply(this, []);
    this.centerX = this.context.canvas.width/2;
    this.centerY = this.context.canvas.height/2;

    this.context.drawImage(this.knob, 0, 0, this.width, this.height);
    this.context.drawImage(this.pointer, 0, 0, this.width, this.height);

    return this;
  };

  // Public API

  Knobicon.prototype = {
    appendTo: function(element) {
      element.appendChild(this.context.canvas);
    }
  }

  // Helpers

  function setCanvasSize() {
    // Defaults to the size of the knob image.
    if (typeof this.width !== 'undefined') {
      this.context.canvas.width = this.width
    } else {
      this.context.canvas.width = this.width = this.knob.width;
    }
    if (typeof this.height !== 'undefined') {
      this.context.canvas.height = this.height
    } else {
      this.context.canvas.height = this.height = this.knob.height;
    }
  }

  function loadImg(src) {
    var img = new Image();
    img.src = src;
    return img;
  }

})();