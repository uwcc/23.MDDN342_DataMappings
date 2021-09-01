/*
 * FaceMap class - holds all informaiton about one mapped
 * face and is able to draw itself.
 */  

// remove this or set to false to enable full program (load will be slower)
var DEBUG_MODE = true;

// this can be used to set the number of sliders to show
var NUM_SLIDERS = 3;

// other variables can be in here too
// here's some examples for colors used
const bg_color = [225, 206, 187];
const fg_color = [151, 102, 52];
const stroke_color = [95, 52, 8];

// example of a global function
// given a segment, this returns the average point [x, y]
function segment_average(segment) {
  let sum_x = 0;
  let sum_y = 0;
  let s_len = segment.length;
  for (let i=0; i<s_len; i++) {
    sum_x = sum_x + segment[i][0];
    sum_y = sum_y + segment[i][1];
  }
  return [sum_x / s_len , sum_y / s_len ];
}

// This where you define your own face object
function Face() {
  // these are state variables for a face
  // (your variables should be different!)

  this.num_eyes = 2;    // can be either 1 (cyclops) or 2 (two eyes)
  this.eye_shift = -1;   // range is -10 to 10
  this.mouth_value = 1;  // range is 0.5 to 8

  // example of a function *inside* the face object.
  // this draws a segment, and do_loop will connect the ends if true
  this.draw_segment = function(segment, do_loop) {
    for(let i=0; i<segment.length; i++) {
        let px = segment[i][0];
        let py = segment[i][1];
        ellipse(px, py, 0.1);
        if(i < segment.length - 1) {
          let nx = segment[i+1][0];
          let ny = segment[i+1][1];
          line(px, py, nx, ny);
        }
        else if(do_loop) {
          let nx = segment[0][0];
          let ny = segment[0][1];
          line(px, py, nx, ny);
        }
    }
  };

  /*
   * Draw the face with position lists that include:
   *    chin, right_eye, left_eye, right_eyebrow, left_eyebrow
   *    bottom_lip, top_lip, nose_tip, nose_bridge, 
   */  
  this.draw = function(positions) {
    // head
    stroke(stroke_color);
    fill(fg_color);
    ellipse(0, 0, 3, 4);
    noStroke();

    // mouth
    fill(bg_color);
    ellipse(0, 0.64, 1.36, 0.25 * this.mouth_value);

    // eyebrows
    fill(0);
    stroke(0);
    strokeWeight(0.08);
    this.draw_segment(positions.left_eyebrow);
    this.draw_segment(positions.right_eyebrow);

    // draw segments of face using points
    fill(128);
    stroke(128);
    this.draw_segment(positions.chin);

    fill(100, 0, 100);
    stroke(100, 0, 100);
    this.draw_segment(positions.nose_bridge);
    this.draw_segment(positions.nose_tip);

    strokeWeight(0.03);

    fill(200, 0, 0);
    stroke(200, 0, 0);
    this.draw_segment(positions.top_lip);
    this.draw_segment(positions.bottom_lip);

    fill(255);
    stroke(255);

    let left_eye_pos = segment_average(positions.left_eye);
    let right_eye_pos = segment_average(positions.right_eye);

    // eyes
    noStroke();
    let curEyeShift = 0.04 * this.eye_shift;
    if(this.num_eyes == 2) {
      fill(bg_color);
      ellipse(left_eye_pos[0], left_eye_pos[1], 0.45, 0.27);
      ellipse(right_eye_pos[0], right_eye_pos[1], 0.45, 0.27);

      fill(fg_color);
      ellipse(left_eye_pos[0] + curEyeShift, left_eye_pos[1], 0.18);
      ellipse(right_eye_pos[0] + curEyeShift, right_eye_pos[1], 0.18);
    }
    else {
      let eyePosX = (left_eye_pos[0] + right_eye_pos[0]) / 2;
      let eyePosY = (left_eye_pos[1] + right_eye_pos[1]) / 2;

      fill(bg_color);
      ellipse(eyePosX, eyePosY, 0.45, 0.27);

      fill(fg_color);
      ellipse(eyePosX - 0.1 + curEyeShift, eyePosY, 0.18);
    }
  }

  /* set internal properties based on list numbers 0-100 */
  this.setProperties = function(settings) {
    this.num_eyes = int(map(settings[0], 0, 100, 1, 2));
    this.eye_shift = map(settings[1], 0, 100, -2, 2);
    this.mouth_value = map(settings[2], 0, 100, 0.5, 8);
  }

  /* get internal properties as list of numbers 0-100 */
  this.getProperties = function() {
    let settings = new Array(3);
    settings[0] = map(this.num_eyes, 1, 2, 0, 100);
    settings[1] = map(this.eye_shift, -2, 2, 0, 100);
    settings[2] = map(this.mouth_value, 0.5, 8, 0, 100);
    return settings;
  }
}
