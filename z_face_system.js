// Arithmetic mean
let getMean = function (data) {
    return data.reduce(function (a, b) {
        return Number(a) + Number(b);
    }) / data.length;
};

// Standard deviation
let getSD = function (data) {
    let m = getMean(data);
    return Math.sqrt(data.reduce(function (sq, n) {
            return sq + Math.pow(n - m, 2);
        }, 0) / (data.length - 1));
};

const LM_LEN = 68;
const LM_parts = ['chin', 'left_eyebrow', 'right_eyebrow',
'nose_bridge', 'nose_tip', 'left_eye', 'right_eye',
'top_lip', 'bottom_lip'];
const LM_names = [
'chin', 'chin', 'chin', 'chin', 'chin',
'chin', 'chin', 'chin', 'chin', 'chin',
'chin', 'chin', 'chin', 'chin', 'chin',
'chin', 'chin',
'left_eyebrow', 'left_eyebrow', 'left_eyebrow', 'left_eyebrow', 'left_eyebrow',
'right_eyebrow', 'right_eyebrow', 'right_eyebrow', 'right_eyebrow', 'right_eyebrow',
'nose_bridge', 'nose_bridge', 'nose_bridge', 'nose_bridge',
'nose_tip', 'nose_tip', 'nose_tip', 'nose_tip', 'nose_tip',
'left_eye', 'left_eye', 'left_eye', 'left_eye', 'left_eye', 'left_eye',
'right_eye', 'right_eye', 'right_eye', 'right_eye', 'right_eye', 'right_eye',
'lip', 'lip', 'lip', 'lip',
'lip', 'lip', 'lip', 'lip',
'lip', 'lip', 'lip', 'lip',
'lip', 'lip', 'lip', 'lip',
'lip', 'lip', 'lip', 'lip'
]
// https://github.com/ageitgey/face_recognition/blob/d34c622bf42e2c619505a4884017051ecf61ac77/face_recognition/api.py#L190
const top_lip_indices =    [48, 49, 50, 51, 52, 53, 54, 64, 63, 62, 61, 60];
const bottom_lip_indices = [54, 55, 56, 57, 58, 59, 48, 60, 67, 66, 65, 64];

function get_landmarks(faceDescriptions) {
  let landmarks = []
  for(let i=0; i<faceDescriptions.length; i++) {
    let curLM = {
      'chin': [],
      'left_eyebrow': [],
      'right_eyebrow': [],
      'nose_bridge': [],
      'nose_tip': [],
      'left_eye': [],
      'right_eye': [],
      'top_lip': [],
      'bottom_lip': []
    };
    let lm = faceDescriptions[i].landmarks;
    let lpts = lm.positions;
    let x_points = [];
    let y_points = [];
    // print(lpts.length)
    for(let j=0; j<LM_LEN; j++) {
      x_points.push(lpts[j].x)
      y_points.push(lpts[j].y)
    }
    let mean_x = getMean(x_points);
    let mean_y = getMean(y_points);
    for(let j=0; j<LM_LEN; j++) {
      x_points[j] = x_points[j] - mean_x;
      y_points[j] = y_points[j] - mean_y;
    }
    let sdev_x = getSD(x_points);
    let sdev_y = getSD(y_points);
    let sdev = sdev_x > sdev_y ? sdev_x : sdev_y;
    // let p1 = lpts[27]
    // let p2 = lpts[28]
    // EYES VERSION
    // let p1 = lpts[36];
    // let p2 = lpts[42];
    // EARS VERSION
    let p1 = lpts[2];
    let p2 = lpts[14];
    let xd = p1.x - p2.x;
    let yd = p1.y - p2.y;
    let angle = Math.atan2(-yd, -xd);
    let s_a = Math.sin(-angle);
    let c_a = Math.cos(-angle);
    let raw_points = []
    for(let j=0; j<LM_LEN; j++) {
      let pt = [0, 0]
      pt[0] = lpts[j].x - mean_x;
      pt[1] = lpts[j].y - mean_y;
      pt[0] = pt[0] / sdev;
      pt[1] = pt[1] / sdev;
      let x_new = pt[0] * c_a - pt[1] * s_a;
      let y_new = pt[0] * s_a + pt[1] * c_a;
      pt[0] = x_new;
      pt[1] = y_new;
      raw_points.push(pt);
    }
    // put all raw points into landmarks objects
    // first everything but the lips (which start at 48)
    for(let j=0; j<48; j++) {
      let key = LM_names[j];
      curLM[key].push(raw_points[j]);
    }
    // now the lips, which have dupes
    for(let j=0; j<top_lip_indices.length; j++) {
      let cur_ix = top_lip_indices[j];
      let cur_pt = raw_points[cur_ix];
      let pt_copy = [cur_pt[0], cur_pt[1]];
      curLM['top_lip'].push(pt_copy);
    }
    for(let j=0; j<bottom_lip_indices.length; j++) {
      let cur_ix = bottom_lip_indices[j];
      let cur_pt = raw_points[cur_ix];
      let pt_copy = [cur_pt[0], cur_pt[1]];
      curLM['bottom_lip'].push(pt_copy);
    }
    curLM['transform'] = {
      'center': [mean_x, mean_y],
      'scale': sdev,
      'angle': angle
    }
    landmarks.push(curLM);
  }
  // print(JSON.stringify(landmarks));
  return landmarks;
}

function get_latents(faceDescriptions) {
  latents = [];
  for(let i=0; i<faceDescriptions.length; i++) {
    let lm = faceDescriptions[i].descriptor;
    latents.push(lm);
    // print(lm);
  }
  return latents;
}
