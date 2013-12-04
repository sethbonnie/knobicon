(function() {

  Knobicon = function(knobImgSrc, pointerImgSrc, options) {
    var self = this;

    if (arguments.length < 2 || 
        typeof knobImgSrc !== 'string' ||
        typeof pointerImgSrc !== 'string')
      throw new Error("Missing/invalid required argument");

    this.context = document.createElement('canvas').getContext('2d');

    if (options) {
      this.width  = typeof options.width !== 'undefined' ? options.width : undefined;
      this.height = typeof options.height !== 'undefined' ? options.height : undefined;
    }

    this.init = function() {
      options = options || {};

      setCanvasSize.apply(self, []);
      this.centerX = this.context.canvas.width/2;
      this.centerY = this.context.canvas.height/2;

      self.knobRadius = options.knobRadius ? options.knobRadius : self.width / 2;

      self.context.drawImage(self.knob, 0, 0, self.width, self.height);
      self.context.drawImage(self.pointer, 0, 0, self.width, self.height);
    };

    loadImg.apply(this, [pointerImgSrc, 'pointer']);
    loadImg.apply(this, [knobImgSrc, 'knob']);
    addMouseHanders.apply(this,[]);

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
    } else if (typeof this.knob !== 'undefined') {
      this.context.canvas.width = this.width = this.knob.width;
    }
    if (typeof this.height !== 'undefined') {
      this.context.canvas.height = this.height
    } else if (typeof this.knob !== 'undefined') {
      this.context.canvas.height = this.height = this.knob.height;
    }
  }

  function addMouseHanders() {
    var knob = this;

    knob.context.canvas.onmousedown = function(e) {
      var mouse = windowToCanvas.apply(knob, [e.clientX, e.clientY]);

      e.preventDefault();

      if (mouseInKnob.apply(knob, [mouse.x, mouse.y])) {
        knob.dragging = true;
      }
    };

    window.addEventListener('mouseup', function(e) {
      var mouse = null;

      e.preventDefault();

      if (knob.dragging) {
        knob.dragging = false;
      }
    }, false);
  }

  function windowToCanvas(x, y) {
    var bbox = this.context.canvas.getBoundingClientRect();

    return {
      x: x - bbox.left * (this.context.canvas.width / bbox.width),
      y: y - bbox.top  * (this.context.canvas.height / bbox.height)
    };
  }

  function mouseInKnob(x, y) {
    var dx = this.centerX - x,
        dy = this.centerY - y,
        magnitude = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy,2));
    return magnitude < this.knobRadius;
  }

  function loadImg(src, imgType) {
    var self = this;
    var img = new Image();
    img.src = src;

    img.onload = function(e) {
      if (imgType == 'pointer') {
        self.pointer = img;
        self.pointerLoaded = true;
        if (self.knobLoaded)
          self.init();
      }
      if (imgType == 'knob') {
        self.knob = img;
        self.knobLoaded = true;
        if (self.pointerLoaded)
          self.init();
      }
    };
  }
})();