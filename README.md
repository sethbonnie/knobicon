Knobicon
========

Canvas-based knobs that are created from 2 layered images: a knob image and an pointer/indicator image.

Usage
------

    var knobElement = document.getElementById('knob');
    var knob = new Knobicon('knob.png', 'pointer');
    knob.appendTo(knobElement);

Todo
----
Add a scale with two states (active, not active) that represent the percentage level. We'll redraw the active part according to the current percentage. The not active state will simply be used as a background layer.
