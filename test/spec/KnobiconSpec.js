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
    it('should throw error when sources are not strings', function() {
      expect(function(){Knobicon(1, 2)}).toThrow();
    });

    it("should load up the correct images", function(){
      var knobImg = new Image(),
          pointerImg = new Image(),
          knob = new Knobicon('img/knob.png', 'img/pointer.png');
      knobImg.src = 'img/knob.png';
      pointerImg.src = 'img/pointer.png';

      expect(knob.knob.src).toEqual(knobImg.src);
      expect(knob.pointer.src).toEqual(pointerImg.src);
    });

    it("should default to the knob image's width and height", function() {
      var knobImg = new Image(),
          imgWidth, imgHeight;
      knobImg.src = 'img/knob.png';

      var knob = Knobicon('img/knob.png', 'img/pointer.png');
      expect(knob.width).toBe(knobImg.width);
      expect(knob.height).toBe(knobImg.height);
    });

    it("center coords should be half of the knob image's width and height", function() {
      var knobImg = new Image(),
          imgWidth, imgHeight;
      knobImg.src = 'img/knob.png';
      var knob = Knobicon('img/knob.png', 'img/pointer.png');

      expect(knob.centerX).toBe(knobImg.width/2);
      expect(knob.centerY).toBe(knobImg.height/2);
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
      var height = 650, width = 325;
      var knob = Knobicon('img/knob.png', 
                          'img/pointer.png', 
                          {height: height,
                           width: width});

      expect(knob.centerX).toBe(width/2);
      expect(knob.centerY).toBe(height/2);
    });
  });
});