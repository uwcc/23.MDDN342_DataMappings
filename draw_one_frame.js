function draw_one_frame(cur_frac) {
  // note: to clear the screen draw a rectangle
  // that is width x height - like this
  noStroke();
  fill(10);
  rect(0, 0, width, height);

  // note: all shape sizes, line widths, etc. should be a
  // function of width and height
  let rect_width = height / 10.0;
  let half_width = rect_width / 2;

  // note: animation should progress depending on the 
  // value of cur_frac which goes from 0 to 1, and it
  // should loop seamlessly
  let cur_x = map(cur_frac, 0, 1, 0, width) - half_width;

  fill(200);
  // draw the rect moving across the screen
  rect(cur_x, 0, rect_width, height);
  // a second version (offscreen) for when it loops back around
  rect(cur_x+width, 0, rect_width, height);
  rect(cur_x-width, 0, rect_width, height);

  // note: you can draw optional things depending on "debugView"
  if (debugView) {
    // we'll draw our "keyframes"
    noFill();
    stroke(255, 0, 0);
    strokeWeight(height/100);
    // here we "plug in" the values when cur_frac is 0
    rect(-half_width, 0, rect_width, height);
    rect( width - half_width, 0, rect_width, height);
    rect(-width - half_width, 0, rect_width, height);
  }
}

