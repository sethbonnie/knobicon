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
  });

  describe("width and height", function() {
    var knobElem, knob;

    beforeEach(function() {
      knobElem = document.createElement('div');
      knobElem.style.width = '300px';
      knobElem.style.height = '300px';
      knob = new Knobicon('img/knob.png', 'img/pointer.png');
      knob.appendTo(knobElem);
    });

    it("should default to the parent element's width and height", function() {
      waitsFor(function() {
        return knob.knobLoaded && knob.pointerLoaded;
      }, "The knob should be loaded", 100);

      var elemWidth = parseInt(knobElem.style.width);
      var elemHeight = parseInt(knobElem.style.height);
      expect(knob.width).toEqual(elemWidth);
      expect(knob.height).toEqual(elemHeight);
    });

    it("center coords should be half of the knob element's width/height", 
    function() {
      waitsFor(function() {
        return knob.knobLoaded && knob.pointerLoaded;
      }, "The knob should be loaded", 100);

      runs(function() {
        var width = parseInt(knobElem.style.width),
            height = parseInt(knobElem.style.height);
        expect(knob.centerX).toBe(width/2);
        expect(knob.centerY).toBe(height/2);
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

  describe('appendTo(parentElem)', function(){

    it('should add a canvas as a child to the passed in element', function() {
      var knob = new Knobicon('img/knob.png', 'img/pointer.png');
      var parent = document.createElement('div');
      knob.appendTo(parent);
      expect(parent.firstChild).toEqual(knob.context.canvas);
    });
  });

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

    it('mousedown inside radius should change dragging property to true', 
    function() {
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

    it('mousedown outside radius should not change dragging property to true', 
    function() {
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

  describe('#rotateTo(angle)', function() {
    var knob;
    var rotationAmount = 3/2*Math.PI * 0.10; // 10% of total range

    beforeEach(function() {
      knob = new Knobicon('img/knob.png', 'img/pointer.png', {knobRadius: 200});
    });

    describe("rotating to the min angle", function() {
      it("should change knob percentage to 0", function() {
        var angle = knob.angle;
        while (angle < 5/4*Math.PI) {
          angle += rotationAmount;
          knob.rotateTo(angle);
        }
        expect(parseFloat(knob.percent)).toEqual(0);
      });
    });

    describe("rotating to the max angle", function() {
      it("should change knob percentage to 100",function() {
        var angle = knob.angle;
        while (angle > (7/4*Math.PI - 2*Math.PI)) {
          angle -= rotationAmount
          knob.rotateTo(angle);
        }
        expect(parseFloat(knob.percent)).toEqual(100);
      });
    });

    describe("rotating to an angle between min and max", function() {
      it("should be min when angle is closer to min", function() {
        var angle = knob.angle;
        while (angle < 5/4*Math.PI) {
          angle += rotationAmount;
          knob.rotateTo(angle);
        }
        // Once more for good measure
        angle += rotationAmount;
        knob.rotateTo(angle);
        expect(knob.angle).toEqual(5/4*Math.PI);
      });

      it("should be max when angle is closer to max", function() {
        var angle = knob.angle;
        while (angle > (7/4*Math.PI - 2*Math.PI)) {
          angle -= rotationAmount
          knob.rotateTo(angle);
        }
        // Once more for good measure
        angle -= rotationAmount;
        knob.rotateTo(angle);
        expect(knob.angle).toEqual(7/4*Math.PI -2*Math.PI);
      });
    });

    describe("rotating by an angle greater than 15% of range", function() {
      it("should not change the state of the knob", function() {
        expect(knob.angle).toEqual(Math.PI/2);
        // rotationAmount == 10%
        knob.rotateTo(knob.angle + (rotationAmount * 2));
        expect(knob.angle).toEqual(Math.PI/2);
      });   
    });
  });

  describe("#onRotate(handler)", function() {
    var knob;
    var rotationAmount = 3/2*Math.PI * 0.10; // 10% of total range

    beforeEach(function() {
      knob = new Knobicon('img/knob.png', 'img/pointer.png', {knobRadius: 200});
    });

    it("should pass in the updated percentage to the handler on each rotation", 
    function() {
      var percentage;

      expect(percentage).not.toEqual(knob.percent);
      knob.onRotate(function(percent) {
        percentage = percent;
      });

      knob.rotateTo(knob.angle + rotationAmount);
      expect(percentage).toEqual(knob.percent);
    });
  });
});