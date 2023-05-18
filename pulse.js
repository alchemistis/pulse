let sides = 3;
let angle, px, py;

let colorIndex = 0;

const auraEndpoint = "http://172.21.128.1:8001";
const auraClient = new AuraClient(auraEndpoint);

const colorCycles = Array.of(
  [241, 95, 70],
  [254, 199, 116],
  [254, 199, 116],
  [141, 193, 232],
  [93, 92, 170]
);

const posCycles = Array.of(
  [10, 560, 50],
  [10, 90, 350],
  [10, 225, 900],
  [10, -65, 700],
  [10, 10, 50]
);

let scaleFactor = [1.5, 1.5, 1.5];

let currentTrack = null;
let bpm = 0;

let beatIntervalId = 0;

function setup() {
  // refreshTrack();
  setInterval(refreshTrack, 10000);

  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('antialias', true);
  fill(colorCycles[colorIndex]);
  strokeWeight(3);

  // const bps = bpm / 60;
  // const interval = Math.round(1000 / bps); // Interval in milliseconds

  // beatIntervalId = setInterval(function() {
  //   onBeat();
  // }, interval);
}

function drawComTruise(color, pos) {
  strokeWeight(0);
  fill(color[0], color[1], color[2]);
  translate(pos[0], pos[1], pos[2]);
  box(pos[0], pos[1], pos[2]);
  strokeWeight(3);
}

function draw() {
  scale(scaleFactor[0], scaleFactor[1], scaleFactor[2]);

  fill(colorCycles[colorIndex]);
  background(236, 222, 237);

  rotateX(frameCount * 0.01);
  rotateZ(frameCount * 0.01);
  ngon(sides, 0, 0, 80);

  for (let posIndex = 0; posIndex < posCycles.length; posIndex++) {
    drawComTruise(colorCycles[colorIndex], posCycles[colorIndex]);
  }
}

function ngon(n, x, y, d) {
  beginShape(TESS);
  for (let i = 0; i < n + 1; i++) {
    angle = TWO_PI / n * i;
    px = x + sin(angle) * d / 2;
    py = y - cos(angle) * d / 2;
    vertex(px, py, 0);
  }
  for (let i = 0; i < n + 1; i++) {
    angle = TWO_PI / n * i;
    px = x + sin(angle) * d / 4;
    py = y - cos(angle) * d / 4;
    vertex(px, py, 0);
  }
  endShape();
}

function onBeat() {
  if (sides > 6) {
    sides = 3;
  } else {
    sides++;
  }

  colorIndex++;
  if (colorIndex >= colorCycles.length) {
    colorIndex = 0;
  }

  const r = random();

  if (r <= 0.2) {
    scaleFactor = [2.5, 2.5, 2.5]
  }
  else if (r <= 0.4) {
    scaleFactor = [4.5, 4.5, 4.5]
  }
  else {
    scaleFactor = [1.5, 1.5, 1.5]
  }
}

function onTrackChanged(newTrack) {
  console.log("Track changed!");

  const bpm = Math.round(newTrack.Bpm);
  const bps = bpm / 60;
  const interval = Math.round(1000 / bps); // Interval in milliseconds
  const progress = newTrack.Progress;

  // TODO: Take Spotify round-trip latency into account...

  // Find out how much time has passed since the last beat
  const timeSinceLastBeat = progress % interval;

  // Calculate the time until the next beat
  const timeUntilNextBeat = interval - timeSinceLastBeat;

  clearInterval(beatIntervalId);

  setTimeout(function() {
    onBeat();
    beatIntervalId = setInterval(function() {
      onBeat();
    }, interval);
  }, timeUntilNextBeat);

  updateDisplayText(newTrack);
}

async function refreshTrack() {
  console.log("Fetching track data from aura-api...");

  let track = await auraClient.getCurrentlyPlayingTrack();

  let hasProgressReset = currentTrack && currentTrack.Progress > track.Progress;

  if (!deepEqual(currentTrack, track) || hasProgressReset) {
    onTrackChanged(track);
  }

  currentTrack = track;

  bpm = Math.round(currentTrack.Bpm);
  console.log(`SONG: ${currentTrack.Artist} - ${currentTrack.Name}`);
  console.log(`BPM: ${Math.round(currentTrack.Bpm)}`);
  console.log(`PROGRESS (ms): ${currentTrack.Progress}`);
}

function deepEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

function updateDisplayText(track) {
  document.getElementById("current-track-label").innerText = `${track.Artist} - ${track.Name} 【=◈︿◈=】`;
}