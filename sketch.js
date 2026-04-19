let modelURL = "https://teachablemachine.withgoogle.com/models/gZvJCL7Ru/";

let classifier;
let currentLabel = "모델을 불러오는 중입니다...";
let currentConfidence = 0;
let bgColor;
let pulseSize = 120;

// 真实标签名
const LABEL_A = "背景噪声";
const LABEL_B = "keyboard";
const LABEL_C = "silence";

function preload() {
  const options = {
    probabilityThreshold: 0.7
  };
  classifier = ml5.soundClassifier(modelURL, options);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  bgColor = color(30, 30, 30);

  currentLabel = "모델 로딩 완료, 소리를 인식하는 중입니다...";
  classifier.classifyStart(gotResult);
}

function draw() {
  background(bgColor);

  const cx = width / 2;
  const cy = height / 2;

  let targetSize = map(currentConfidence, 0, 1, 120, 280);
  pulseSize = lerp(pulseSize, targetSize, 0.1);

  noFill();
  stroke(255, 120);
  strokeWeight(2);

  for (let i = 0; i < 3; i++) {
    let waveSize = pulseSize + i * 35;
    ellipse(cx, cy, waveSize, waveSize);
  }

  noStroke();
  fill(255, 180);
  ellipse(cx, cy, pulseSize, pulseSize);

  fill(255);
  ellipse(cx, cy, pulseSize * 0.28, pulseSize * 0.28);

  fill(255);
  textSize(24);
  text("Teachable Machine 사운드 인식", width / 2, 60);

  textSize(34);
  text(currentLabel, width / 2, height * 0.70);

  textSize(20);
  text(
    "신뢰도: " + nf(currentConfidence * 100, 2, 1) + "%",
    width / 2,
    height * 0.78
  );

  textSize(18);
  text("현재 라벨: " + currentLabel, width / 2, height * 0.85);

  textSize(16);
  fill(255, 180);
  text("라벨마다 배경색이 고정되어 바뀝니다.", width / 2, height - 40);
}

function gotResult(results) {
  if (!results || results.length === 0) return;

  currentLabel = String(results[0].label).trim();
  currentConfidence = results[0].confidence;

  updateBackgroundByLabel(currentLabel);
}

function updateBackgroundByLabel(label) {
  const clean = label.trim();

  if (clean === LABEL_A) {
    bgColor = color(120, 120, 120); // 회색
  } else if (clean === LABEL_B) {
    bgColor = color(70, 130, 255); // 파란색
  } else if (clean === LABEL_C) {
    bgColor = color(80, 200, 120); // 초록색
  } else {
    bgColor = color(180, 100, 220); // 예외 색상
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}