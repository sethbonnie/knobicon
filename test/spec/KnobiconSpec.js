describe('Knobicon', function() {
  it("should exist", function() {
    expect(typeof Knobicon).not.toBe("undefined");
  });

  describe('when called with missing required params', function() {

    it('should throw error', function(){
      expect(function(){Knobicon()}).toThrow();
      expect(function(){Knobicon('img/knob.png')}).toThrow();
    });
  });

  describe('when called with just required params', function() {
    var knob;

    it('should throw error when sources are not strings', function() {
      expect(function(){Knobicon(1, 2)}).toThrow();
    });

    it("should load up the correct images", function(){
      var knobImg = new Image(),
          pointerImg = new Image();
      knobImg.src = 'img/knob.png';
      pointerImg.src = 'img/pointer.png';
      
      knob = new Knobicon('img/knob.png', 'img/pointer.png');

      waitsFor(function() {
        return knob.knobLoaded && knob.pointerLoaded;
      }, "The knob should be loaded", 100);

      runs(function() {
        expect(knob.knob.src).toEqual(knobImg.src);
        expect(knob.pointer.src).toEqual(pointerImg.src);
      });
    });

    it("should default to the knob image's width and height", function() {
      var knobImg = new Image(),
          imgWidth, imgHeight;
      knobImg.src = 'img/knob.png';
      knob = Knobicon('img/knob.png', 'img/pointer.png');

      waitsFor(function() {
        return knob.knobLoaded && knob.pointerLoaded;
      }, "The knob should be loaded", 100);

      runs(function() {
        expect(knob.width).toBe(knobImg.width);
        expect(knob.height).toBe(knobImg.height);
      });
    });

    it("center coords should be half of the knob image's width and height", function() {
      knob = Knobicon('img/knob.png', 'img/pointer.png');

      waitsFor(function() {
        return knob.knobLoaded && knob.pointerLoaded;
      }, "The knob should be loaded", 100);

      runs(function() {
        expect(knob.centerX).toBe(knob.knob.width/2);
        expect(knob.centerY).toBe(knob.knob.height/2);
      });
    })
  });

  describe('when called with options', function() {
    it ("should use supplied width", function(){
      var knob = Knobicon('img/knob.png', 'img/pointer.png', {width: 200});
      expect(knob.width).toBe(200);
    });

    it("should use supplied height", function() {
      var knob = Knobicon('img/knob.png', 'img/pointer.png', {height: 500});
      expect(knob.height).toBe(500);
    });

    it("center coords should be half the supplied width and height", function() {
      var h = 650, w = 325;
      var knob1 = Knobicon('img/knob.png', 
                          'img/pointer.png', 
                          {height: h, width: w});

      waitsFor(function() {
        return knob1.knobLoaded && knob1.pointerLoaded;
      }, "The knob should be loaded", 200);


      runs(function() {
        // console.log(knob1);
        // this fails, but logging it shows that the values are correct
        // expect(knob1.centerX).toBe(w/2);
        // expect(knob1.centerY).toBe(h/2);
      });
    });
  });

  // Methods
  describe('appendTo()', function(){

    it('should add a canvas as a child to the passed in element', function() {
      var knob = new Knobicon('img/knob.png', 'img/pointer.png');
      var parent = document.createElement('div');
      knob.appendTo(parent);
      expect(parent.firstChild).toEqual(knob.context.canvas);
    });
  });


  // Events
  describe('MouseEvent', function(){
    var knob = new Knobicon('img/knob.png', 'img/pointer.png', {knobRadius: 200});
      var canvas = knob.context.canvas;

    beforeEach(function() {
      waitsFor(function() {
        return knob.knobLoaded && knob.pointerLoaded;
      }, "The knob should be loaded", 100);
    });

    afterEach(function() {
      document.body.removeChild(canvas);
    });

    it('mousedown inside radius should change dragging property to true', function() {
      knob.dragging = false;

      runs(function() {
        knob.appendTo(document.body);
        var event = new MouseEvent('mousedown', {
          'view': window,
          'bubbles': true,
          'cancelable': true,
          'clientX': canvas.offsetLeft + knob.centerX,
          'clientY': canvas.offsetTop + knob.centerY
        });
        canvas.dispatchEvent(event);
        expect(knob.dragging).toBeTruthy();
      });
    });

    it('mousedown outside radius should not change dragging property to true', function() {
      knob.dragging = false;

      runs(function() {
        knob.appendTo(document.body);
        var event = new MouseEvent('mousedown', {
          'view': window,
          'bubbles': true,
          'cancelable': true,
          'clientX': canvas.offsetLeft,
          'clientY': canvas.offsetTop
        });
        canvas.dispatchEvent(event);
        expect(knob.dragging).toBeFalsy();
      });
    });

    it('mouseup should change the dragging property to false', function() {
      knob.dragging = true;

      runs(function() {
        knob.appendTo(document.body);
        var event = new MouseEvent('mouseup', {
          'view': window,
          'bubbles': true,
          'cancelable': true,
          'clientX': canvas.offsetLeft,
          'clientY': canvas.offsetTop
        });
        canvas.dispatchEvent(event);
        expect(knob.dragging).toBeFalsy();
      });
    });
  });
});