// placeholders
let video
let poseNet
let poses = []

// https://github.com/processing/p5.js/wiki/Positioning-your-canvas

// canvas place holder
var cnv

// canvas helpers
function centerCanvas() {
  var x = (windowWidth - width) / 2
  var y = (windowHeight - height) / 2
  cnv.position(x, y)
}

function windowResized() {
  centerCanvas()
}

// https://github.com/ml5js/ml5-library/blob/main/src/PoseNet/index.js
// https://github.com/tensorflow/tfjs-models/tree/master/body-pix#resnet-larger-slower-more-accurate-new

// Only draw an ellipse is the pose probability is bigger than POSE_PROBABILITY_THRESHOLD
// const POSE_PROBABILITY_THRESHOLD = 0.2;
// const POSE_PROBABILITY_THRESHOLD = 0.5;
const POSE_PROBABILITY_THRESHOLD = 0.7

// const DEFAULTS = {
//   architecture: "MobileNetV1", // 'MobileNetV1', 'ResNet50'
//   outputStride: 16, // 8, 16, 32
//   flipHorizontal: false, // true, false
//   minConfidence: 0.5,
//   maxPoseDetections: 5, // any number > 1
//   scoreThreshold: 0.5,
//   nmsRadius: 20, // any number > 0
//   detectionType: "multiple", // 'single'
//   inputResolution: 256, // or { width: 257, height: 200 }
//   multiplier: 0.75, // 1.01, 1.0, 0.75, or 0.50 -- only for MobileNet
//   quantBytes: 2, // 4, 2, 1
//   modelUrl: null, // url path to model
// };

const CustomResNet50Config = {
  architecture: 'ResNet50',
  outputStride: 32,
  flipHorizontal: false,
  minConfidence: 0.5,
  maxPoseDetections: 5,
  //   scoreThreshold: 0.4, // 0.5
  scoreThreshold: 0.5,
  nmsRadius: 20,
  //   detectionType: "multiple", // 'single'
  detectionType: 'single',
  inputResolution: 256,
  multiplier: null,
  quantBytes: 4, // 4, 2, 1
  modelUrl: null,
}

const CustomMobileNetV1Config = {
  architecture: 'MobileNetV1',
  outputStride: 16,
  flipHorizontal: false,
  minConfidence: 0.5,
  maxPoseDetections: 5,
  //   scoreThreshold: 0.4, // 0.5
  scoreThreshold: 0.5,
  nmsRadius: 20,
  //   detectionType: "multiple", // 'single'
  detectionType: 'single',
  inputResolution: 256,
  multiplier: 1.0, // 1.01, 1.0 , 0.75 , 0.5
  quantBytes: 4, // 4, 2, 1
  modelUrl: null,
}

// const options = CustomResNet50Config;
const options = CustomMobileNetV1Config
console.log(options)

function setup() {
  const canvasWidth = 640
  const canvasHeight = 480
  cnv = createCanvas(canvasWidth, canvasHeight)
  centerCanvas()

  video = createCapture(VIDEO)
  video.size(width, height)

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, options, modelReady)

  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function (results) {
    poses = results
  })

  // Hide the video element, and just show the canvas
  video.hide()
}

function modelReady() {
  select('#status').html('Model Loaded')
}

function draw() {
  image(video, 0, 0, width, height)

  // We can call both functions to draw all keypoints and the skeletons
  //   drawKeypoints();
  //   drawSkeleton();

  drawSkeletonAndKeypoints()
}

// // A function to draw ellipses over the detected keypoints
// function drawKeypoints() {
//   // Loop through all the poses detected
//   for (let i = 0; i < poses.length; i += 1) {
//     // For each pose detected, loop through all the keypoints
//     const pose = poses[i].pose;
//     for (let j = 0; j < pose.keypoints.length; j += 1) {
//       // A keypoint is an object describing a body part (like rightArm or leftShoulder)
//       const keypoint = pose.keypoints[j];
//       // Only draw an ellipse is the pose probability is bigger than POSE_PROBABILITY_THRESHOLD
//       if (keypoint.score > POSE_PROBABILITY_THRESHOLD) {
//         fill(255, 0, 0);
//         noStroke();
//         ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
//       }
//     }
//   }
// }

// // A function to draw the skeletons
// function drawSkeleton() {
//   // Loop through all the skeletons detected
//   for (let i = 0; i < poses.length; i += 1) {
//     const skeleton = poses[i].skeleton;
//     // For every skeleton, loop through all body connections
//     for (let j = 0; j < skeleton.length; j += 1) {
//       const partA = skeleton[j][0];
//       const partB = skeleton[j][1];
//       stroke(255, 0, 0);
//       line(
//         partA.position.x,
//         partA.position.y,
//         partB.position.x,
//         partB.position.y
//       );
//     }
//   }
// }

// a function to more time efficiently way to draw the skeletons and detected keypoints
function drawSkeletonAndKeypoints() {
  // Loop through all skeletons and poses detected
  for (let i = 0; i < poses.length; i += 1) {
    // For every skeleton, loop through all body connections
    let skeleton = poses[i].skeleton
    // console.log(JSON.stringify(skeleton, null, 2));

    for (let j = 0; j < skeleton.length; j += 1) {
      let partA = skeleton[j][0]
      let partB = skeleton[j][1]

      stroke(255, 0, 0)
      line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y,
      )
    }

    // For every pose detected, loop through all the keypoints
    let pose = poses[i].pose

    for (let j = 0; j < pose.keypoints.length; j += 1) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j]
      //   console.log(JSON.stringify(keypoint, null, 2));

      // Only draw an ellipse is the pose probability is bigger than POSE_PROBABILITY_THRESHOLD
      if (keypoint.score > POSE_PROBABILITY_THRESHOLD) {
        fill(255, 0, 0)
        noStroke()
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10)
      }
    }
  }
}
