(function() {

  Knobicon = function(knobImgSrc, pointerImgSrc, options) {
    var self = this;

    if (arguments.length < 2 || 
        typeof knobImgSrc !== 'string' ||
        typeof pointerImgSrc !== 'string')
      throw new Error("Missing/invalid required argument");

    if (options) {
      this.width  = typeof options.width !== 'undefined' ? 
                    options.width : 
                    undefined;
      this.height = typeof options.height !== 'undefined' ? 
                    options.height : 
                    undefined;
      this.percent = typeof options.percent !== 'undefined' ?
                     options.percent :
                     50;
    }

    this.angle = percentToAngle(this.percent);

    this.context = document.createElement('canvas').getContext('2d');

    this.init = function() {
      options = options || {};

      setCanvasSize.apply(self, []);
      this.centerX = this.context.canvas.width/2;
      this.centerY = this.context.canvas.height/2;

      self.knobRadius = options.knobRadius ? 
                        options.knobRadius : 
                        self.width / 2;
      self.pointerRadius = options.pointerRadius ?
                           options.pointerRadius : 
                           self.knobRadius;

      drawKnob.apply(this, []);
      drawPointer.apply(this, []);
    };

    loadImg.apply(this, [pointerImgSrc, 'pointer']);
    loadImg.apply(this, [knobImgSrc, 'knob']);
    addMouseHanders.apply(this,[]);

    return this;
  };

  // ================================================================
  // Public API
  // ================================================================

  Knobicon.prototype = {
    appendTo: function(element) {
      element.appendChild(this.context.canvas);
    },

    rotateTo: function(angle) {
      var percent = parseFloat( angleToPercent(angle) );
      // only move pointer if percentage within 15%
      // this eliminates huge jumps (especially the one from 0 to 100 
      //  counter-clockwise)
      if (percentageDiff(percent, this.percent) < 15) {
        this.percent = percent;
        this.angle = percentToAngle(this.percent);
        this.context.save();

        erase.apply(this, []);
        drawKnob.apply(this,[]);
        this.context.translate(this.centerX, this.centerY);
        this.context.rotate(-this.angle + Math.PI/2);
        this.context.translate(-this.centerX, -this.centerY);
        drawPointer.apply(this,[]);

        this.context.restore();
      }
    }
  }

  // ================================================================
  // Private Methods
  // ================================================================

  var erase = function() {
    if (this.context) {
      this.context.clearRect(0,0,this.width, this.height);
    }
  }

  var drawKnob = function() {
    if (this.knob)
      this.context.drawImage(this.knob, 0, 0, this.width, this.height);
  };

  var drawPointer = function() {
    if (this.pointer)
      this.context.drawImage(this.pointer, 0, 0, this.width, this.height);
  };

  function setCanvasSize() {
    // Defaults to the size of the knob image.
    if (typeof this.width !== 'undefined') {
      this.context.canvas.width = this.width
    } 
    else if (typeof this.knob !== 'undefined') {
      this.context.canvas.width = this.width = this.knob.width;
    }

    if (typeof this.height !== 'undefined') {
      this.context.canvas.height = this.height
    } 
    else if (typeof this.knob !== 'undefined') {
      this.context.canvas.height = this.height = this.knob.height;
    }
  }

  function addMouseHanders() {
    var knob = this;

    knob.context.canvas.onmousemove = function(e) {
      var mouse = windowToCanvas.apply(knob, [e.clientX, e.clientY]);
      var angle, dx, dy;

      e.preventDefault();

      if (knob.dragging) {
        dx = knob.centerX - mouse.x;
        dy = knob.centerY - mouse.y;
        angle = atan2(dy, dx);
        knob.rotateTo(angle);
      }
    }

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

  // ================================================================
  // Helpers Methods
  // ================================================================

  function toDegrees(radians) { return radians * 180 / Math.PI; }
  function toRadians(degrees) { return degrees * Math.PI / 180; }

  // A normalized version of Math.atan2 -- [0,-2π) instead of [-π,π)
  function atan2(y, x) {
    return -(Math.atan2(y,x) - Math.PI);
  }

  /*
   * The range of movement will be 3π/2
   * Starting from: 5π/4 as 0.0 (0%)
   * Ending at: 7π/4 as 100 (100%)
   * In a clockwise rotation
   *
   * TODO: this function can be generalized to take
   * a min, a max and a range that default to current values
   */
  function angleToPercent(angle) {
    // For angles in the range (5π/4, 7π/4), set it as the one 
    // closest of the two
    if (angle > (5/4*Math.PI) && angle < (7/4*Math.PI)) {
      angle = angle - (3/2*Math.PI) < 0 ? 
              5/4*Math.PI : 
              7/4*Math.PI;
    }
    // Normalize angle for values in the region [7π/4, 2π)
    // since they are bigger than our range of 3π/2
    if (angle >= (7/4*Math.PI) && angle < (2*Math.PI)) {
      // everything works out if we just turn these values
      // into their negative counterparts
      angle = angle - 2*Math.PI;
    }

    // We add π/4 so that our minimum of 5π/4 is aligned with the range
    return ((3/2*Math.PI - (angle + Math.PI/4)) / (3/2*Math.PI)).toFixed(2) * 100;
  }

  function percentToAngle(percent) {
    // Normalize percent to be within [0,100]
    if (percent < 0) {
      percent = 0;
    }
    else if (percent > 100) {
      percent = 100;
    }

    return (5/4 * Math.PI) - ((3/2*Math.PI * percent) / 100);
  }

  function percentageDiff(p1, p2) {
    return Math.abs(p1 - p2);
  }
})();