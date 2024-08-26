var numPoints = 200;
cw = 900;
ch = 600;
var thetapos = [];
var radpos = [];
var velpos = [];
var velclocks = [];
var thetaclocks = [];
var YC1 = ch / 2;
var YC2 = ch / 2;
var YC3 = ch / 2;
var TC1 = 0,
  TC2 = 0,
  TC3 = 0;
var SC1;
var SC2;
var SC3;
var countdown;
var weight;

function setup() {
  cw = $("#clockwrapper").width();
  ch = cw * 0.6;
  $("#clockwrapper").height(ch);
  var canvas = createCanvas(cw, ch);
  canvas.parent("clockwrapper");
  $("#clockwrapper canvas").velocity({ opacity: "0" }, { duration: 0 });
  background(0);

  countdown = 0;
  weight = 8;
  if (cw < 500) {
    weight = 5;
  }
  for (var x = 0; x < numPoints; x = x + 1) {
    thetapos[x] = random(2 * PI);
    radpos[x] = random(cw * 1.2);
    velpos[x] = random(PI / 360);
  }

  //initialize clock speeds;
  for (var x = 0; x < 6; x = x + 1) {
    velclocks[x] = random(PI / 1000) + PI / 1000;

    thetaclocks[x] = random(2 * PI);
  }
  velclocks[1] = -velclocks[1];
  //set constellation heights
  YC1 = int(random(0.5 * ch)) + 0.2 * ch;
  YC2 = int(random(0.5 * ch)) + 0.2 * ch;
  YC3 = int(random(0.5 * ch)) + 0.2 * ch;
  SC1 = 0;
  SC2 = 0;
  SC3 = 0;
  SC1 = random(2 * PI) / 360 + 0.015;
  SC2 = random(2 * PI) / 360 + 0.015;
  SC3 = random(2 * PI) / 360 + 0.015;
  SC1 = SC1 * 0.3;
  SC2 = SC2 * 0.3;
  SC3 = SC3 * 0.3;

  strokeWeight(3);
  stroke(100);
  frameRate = 100;
  $("#clockwrapper canvas").velocity({ opacity: "1" }, { duration: 1000 });
  //  while(!(second()==0)){
  // }
}

function draw() {
  background(0);
  var pointx;
  var pointy;
  var opointx;
  var opointy;
  for (var x = 0; x < numPoints; x = x + 1) {
    pointx = int(radpos[x] * cos(thetapos[x]));
    pointy = int(radpos[x] * sin(thetapos[x]));
    point(pointx, pointy);
    opointx = pointx;
    opointy = pointy;
    //move to the next theta
    thetapos[x] = thetapos[x] - velpos[x];
    //draw the new povar to make a lil trail
    pointx = int(radpos[x] * cos(thetapos[x]));
    pointy = int(radpos[x] * sin(thetapos[x]));
    point(pointx, pointy);
    line(opointx, opointy, pointx, pointy);
  }
  //draw seconds
  var thetasec;
  var curmilsec = millis();

  stroke(255);
  strokeWeight(5);
  for (var x = 0; x < 16; x = x + 2) {
    stroke(255);

    thetasec = ((curmilsec / 1000) * PI) / 8 + (x * PI) / 8;
    pointx = int((cw / 3) * cos(thetasec));
    pointy = int(ch * 0.6 * sin(thetasec)) + ch * 0.5;
    var mplier = 1 - abs(pointy - ch / 2) / (ch / 2);
    stroke(mplier * 255);
    pointy = pointy - ch / 2 + YC1;
    point(pointx, pointy - 15);
    point(pointx, pointy + 15);
  }

  drawClocks();
  for (var x = 0; x < 6; x = x + 1) {
    thetaclocks[x] = thetaclocks[x] + ((255 - countdown) / 255) * velclocks[x];
  }
  stroke(70);
  strokeWeight(3);

  // draw time if applicable
  if (countdown > 0) {
    strokeWeight(0);
    stroke(countdown);
    fill(countdown);
    textSize(weight * 5);
    textAlign(CENTER, CENTER);
    var temphours = int(hour() % 12);
    if (temphours == 0) {
      temphours = 12;
    }
    text(str(temphours), cw * 0.16, YC1);
    text(str(floor(minute() / 10)), cw * 0.5, YC2);
    text(str(minute() % 10), cw * 0.84, YC3);
    countdown = countdown - 1;
    stroke(70);

    strokeWeight(3);
  }
  //move clocks
  calcSpeeds();
}

function starCircle(numStars, maxStars, xCenter, yCenter, radius, rot, weight) {
  stroke(20);
  noFill();
  ellipseMode(CENTER);
  strokeWeight(2);
  ellipse(xCenter, yCenter, 2 * radius, 2 * radius);
  if (!(numStars == 0)) {
    var curx;
    var cury;
    var temprot;

    stroke(255);

    for (var c = 0; c < numStars; c = c + 1) {
      strokeWeight(weight);
      temprot = rot + (float(c) / float(maxStars)) * PI * 2;
      curx = int(radius * cos(temprot)) + xCenter;
      cury = int(radius * sin(temprot)) + yCenter;
      stroke(255);
      if (random(1000) < 2) {
        strokeWeight(weight * 1.2);
      }

      point(curx, cury);
    }
  }
}

function drawClocks() {
  //hours
  var temphours = int(hour() % 12);
  if (temphours == 0) {
    temphours = 12;
  }
  starCircle(temphours, 12, cw * 0.16, YC1, 0.11 * cw, thetaclocks[0], weight);
  //10 minutes
  starCircle(
    floor(minute() / 10),
    6,
    cw * 0.5,
    YC2,
    0.11 * cw,
    thetaclocks[1],
    weight
  );
  //1 minutes
  starCircle(
    minute() % 10,
    10,
    0.84 * cw,
    YC3,
    0.11 * cw,
    thetaclocks[2],
    weight
  );
}
function mouseReleased() {
  countdown = 255;
}

function calcSpeeds() {
  TC1 = TC1 + SC1;
  TC2 = TC2 + SC2;
  TC3 = TC3 + SC3;
  if (TC1 > 2 * PI) {
    TC1 = TC1 - 2 * PI;
  }
  if (TC2 > 2 * PI) {
    TC2 = TC2 - 2 * PI;
  }
  if (TC3 > 2 * PI) {
    TC3 = TC3 - 2 * PI;
  }
  YC1 = sin(TC1) * 0.25 * ch + ch / 2;

  YC2 = sin(TC2) * 0.25 * ch + ch / 2;

  YC3 = sin(TC3) * 0.25 * ch + ch / 2;
}

$(window).resize(function () {
  cw = $("#clockwrapper").width();
  ch = cw * 0.6;
  $("#clockwrapper").height(ch);
  resizeCanvas(cw, ch);
  weight = 8;
  if (cw < 500) {
    weight = cw / 75;
  }
});
