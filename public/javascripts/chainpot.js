

// const genRanHex = size => "0x" + [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

// let randHash = genRanHex(64)

// let tokenData = {
 // hash: "0xc55ae463bb7d4a2471786426ddc23ba8ec120e82364990a7df13323a6c135a92",
  // hash: randHash,
  // tokenId: 345123344
// }
// console.log(randHash)

///
let tokenData = window.tokenHash

let hashhash = tokenData.slice(2,66)

const hashcombo = hashhash + [...hashhash].reverse().join('')

let hashPairs = [];

for (let j = 0; j < 64; j++) {
  hashPairs.push(hashcombo.slice(0 + (j * 2), 2 + (j * 2)));
}

let hashIndex = 0


let hashData = hashPairs.map(x => {
  return parseInt(x, 16) / 255;
});
  
  let allcombi = Object.keys(chroma.brewer);
  
  // console.log(chroma.brewer)

function setup() {
  if(window.innerHeight <= window.innerWidth) {
      SIZE = window.innerHeight
  } else {
      SIZE = window.innerWidth
  }
  createCanvas(SIZE, SIZE);
  // frameRate(30)
  // createLoop({duration:6, gif:true})
  
}

function draw() {
  // let SIZE = width;
  // let SIZE = height;

  // let = 
  hashIndex = hashData.length - 1

  // let totalRadius = 250;
  let totalRadius = Math.min(SIZE, SIZE) * 0.45;

  let trrx = width / 2;
  let trry = height / 2;

  translate(trrx, trry);
  let numOrbits = round(map(hashData[inc()], 0, 1, 1, 12));
  // let numOrbits = 6;
  let numCircles = round(map(hashData[inc()], 0, 1, 1, 20));
  background(0);

  let circlesinOrbitsArray = [];
  let symmetryinOrbitsArray = [];
  // hashData[inc()]
  let globspinphase = 1;
  var ang1;
  if (mouseIsPressed) {
    ang1 = (millis() / 10000) * map(mouseX, 0, SIZE / 2, 0.05,1, true) * map(mouseX, SIZE / 2, SIZE, 1,20, true)
  } else {
    ang1 = (millis() / 10000)
  }
  // let wheremousex =  map(mouseX, 0, SIZE, 0,1, true)
  // console.log(wheremousex)
  // // var ang1 = (millis() / 10000) * map(mouseX, 0, SIZE, 1,20, true)

  let whichRotate = hashData[inc()] * 100;

  let rotateoption;

  if (whichRotate <= 10) {
    rotateoption = 0;
  } else if (whichRotate <= 20) {
    rotateoption = 1;
  } else if (whichRotate <= 30) {
    rotateoption = 2;
  } else if (whichRotate <= 40) {
    rotateoption = 3;
  } else if (whichRotate <= 47) {
    rotateoption = 4;
  } else if (whichRotate <= 54) {
    rotateoption = 5;
  } else if (whichRotate <= 61) {
    rotateoption = 6;
  } else if (whichRotate <= 68) {
    rotateoption = 7;
  } else if (whichRotate <= 85) {
    rotateoption = 8;
  } else if (whichRotate <= 92) {
    rotateoption = 9;
  } else if (whichRotate <= 96) {
    rotateoption = 10;
  } else if (whichRotate <= 100) {
    rotateoption = 11;
  }

  const areObjectsRotating = hashData[inc()] < 0.5;



  let selectPallette = floor(
    (hashData[inc()]) * (allcombi.length)
  );
  
  let palettename = allcombi[selectPallette]
  
  let pallette = chroma
    .scale(palettename)
    .mode("lab")
    .colors(numOrbits);

  if (hashData[inc()] < 0.3) {
    for (let i = pallette.length - 1; i > 0; i--) {
      const j = Math.floor(hashData[inc()] * i);
      const temp = pallette[i];
      pallette[i] = pallette[j];
      pallette[j] = temp;
    }
  }

  let colorswitch = hashData[inc()] * 100;
  // console.log(colorswitch)
  // let colorswitch = 58;
  let colorchoice;

  if (colorswitch <= 20) {
    colorchoice = 0;
  } else if (colorswitch <= 40) {
    colorchoice = 1;
  } else if (colorswitch <= 60) {
    pallette = chroma.scale(allcombi[selectPallette]).mode("lab").colors(30);
    colorchoice = 2;
  } else if (colorswitch <= 65) {
    colorchoice = 3;
  } else if (colorswitch <= 70) {
    colorchoice = 4;
  } else if (colorswitch <= 75) {
    colorchoice = 5;
  } else if (colorswitch <= 80) {
    colorchoice = 6;
  } else if (colorswitch <= 85) {
    colorchoice = 7;
  } else if (colorswitch <= 90) {
    colorchoice = 8;
  } else if (colorswitch <= 100) {
    colorchoice = 9;
  }
  
  //GLOBAL COLOR VARIABLE FOR OPTION 09
  let rglob = Math.round(map(hashData[inc()], 0, 1, 50, 255));
  let gglob = Math.round(map(hashData[inc()], 0, 1, 50, 255));
  let bglob = Math.round(map(hashData[inc()], 0, 1, 50, 255));

  ///// SHAPE SELECTOR START

  let shapeSequence = [1, 2, 3, 4, 0, 5, 6, 7, 8];
  let shapeSequenceNames = {
    1: "tringle",
    2: "square",
    3: "pentagon",
    4: "hexagon",
    0: "circle",
    5: "star_1",
    6: "star_2",
    7: "star_3",
    8: "star_4"
  };
  if (hashData[inc()] < 0.5) {
    for (let i = shapeSequence.length - 1; i > 0; i--) {
      const j = Math.floor(hashData[inc()] * i);
      const temp = shapeSequence[i];
      shapeSequence[i] = shapeSequence[j];
      shapeSequence[j] = temp;
    }
  }

  let sequenceLength = floor(
    map(hashData[inc()], 0, 1, 2, 9)
  );

  let shapeRandom = hashData[inc()] * 100;
  // let shapeRandom = 85;
  // console.log(shapeRandom)
  // let shapeRandom = 88
  let nameList = [];
  shapeSequence
    .slice(0, sequenceLength)
    .forEach((item) => nameList.push(shapeSequenceNames[item]));
  // console.log("[" + nameList.join(", ") + "]")
  // console.log(shapeSequence.slice(0,sequenceLength))
  // console.log(shapeSequence)
  // console.log(nameList)
  let whichShapesSelect;

  if (shapeRandom <= 20) {
    whichShapesSelect = 0;
  } else if (shapeRandom <= 28) {
    whichShapesSelect = 1;
  } else if (shapeRandom <= 36) {
    whichShapesSelect = 2;
  } else if (shapeRandom <= 44) {
    whichShapesSelect = 3;
  } else if (shapeRandom <= 52) {
    whichShapesSelect = 4;
  } else if (shapeRandom <= 60) {
    whichShapesSelect = 5;
  } else if (shapeRandom <= 68) {
    whichShapesSelect = 6;
  } else if (shapeRandom <= 76) {
    whichShapesSelect = 7;
  } else if (shapeRandom <= 84) {
    whichShapesSelect = 8;
  } else if (shapeRandom <= 90) {
    whichShapesSelect = 9;
  } else if (shapeRandom <= 95) {
    whichShapesSelect = 10;
    // } else if (shapeRandom <= 96) {
    //   whichShapesSelect = 11;
    //   shapeAttribute.current = "Shape sequence with " + sequenceLength.toString() + "shapes";
  } else if (shapeRandom <= 97) {
    whichShapesSelect = 11;
  } else if (shapeRandom <= 99) {
    whichShapesSelect = 12;
  } else if (shapeRandom <= 100) {
     whichShapesSelect = 13
  }
  
 

  // console.log("which shapes", whichShapesSelect)
  ///// SHAPE SELECTOR END

  for (let pp = 0; pp < numOrbits; pp++) {
    let Inset = (pp / numOrbits) * totalRadius;
    let Radius = totalRadius - Inset;

    let numCircless;
    hashData[inc()] < 0.5 ?
      (numCircless = round(
        map(hashData[inc()], 0, 1, 1, 20)
      )) :
      (numCircless = numCircles);

    circlesinOrbitsArray.push(numCircless);

    let symmetry;
    let coin2 = hashData[inc()];
    numCircless > numCircles ?
      (symmetry = numCircless) :
      coin2 < 0.2 ?
      (symmetry = numCircles) :
      (symmetry = numCircless);

    symmetryinOrbitsArray.push(coin2 < 0.2 ? "no" : "yes");

    let rot1mul = map(hashData[inc()], 0, 1, 0.1, 10);
    let rot2mul = map(hashData[inc()], 0, 1, 0.1, 10);
    let polarityglob = round(hashData[inc()]) * 2 - 1;

    let ccc1 = Math.round(map(hashData[inc()], 0, 1, 50, 255));
    let ccc2 = Math.round(map(hashData[inc()], 0, 1, 50, 255));
    let ccc3 = Math.round(map(hashData[inc()], 0, 1, 50, 255));

    for (let i = 0; i < numCircless; i++) {
      let color = distributeColors(
        colorchoice,
        i,
        pp,
        pallette,
        ccc1,
        ccc2,
        ccc3,
        rglob,
        gglob,
        bglob
      );

      let xpos = Inset + Radius;
      let ypos = Inset + Radius;
      xpos = xpos + Radius * Math.sin((i / symmetry) * PI * 2);
      ypos =
        ypos + Radius * Math.sin((i / numCircles) * PI * 2 - PI / 2);

      let polarity = round(hashData[inc()]) * 2 - 1;
      push();

      // ROTATING IS HERE
      rotationChoice(
        rotateoption,

        pp,
        i,
        symmetry,
        ang1,
        rot1mul,
        rot2mul,
        globspinphase,
        polarityglob,
        polarity
      );

      translate(Radius, 0);
      if (whichShapesSelect != 13) {
      if (areObjectsRotating) {
        0.5 < hashData[inc()] ?
          rotate(millis() / 1000) :
          rotate((millis() / 1000) * -1);
      }
      }
    
      drawShape(
        // shapeswitch,
        whichShapesSelect,
        shapeSequence,
        sequenceLength,
        i,
        pp,
        totalRadius
      );
      
      pop();
      
    }
  }

}

function inc() {
  hashIndex = (hashIndex + 1) % hashData.length;
  return hashIndex
}

function distributeColors(
  colorchoice,
  i,
  pp,
  pallette,
  ccc1,
  ccc2,
  ccc3,
  rglob,
  gglob,
  bglob
) {
  let colorr;
  switch (colorchoice) {
    case 0:
      colorr = color(pallette[i % pallette.length]);
      break;
    case 1:
      colorr = color(pallette[pp % pallette.length]);
      break;
    case 2:
      colorr = color(
        pallette[round(hashData[inc()] * (pallette.length - 1))]
      );
      break;
    case 3:
      colorr = color(
        Math.round(map(hashData[inc()], 0, 1, 200, 255)),
        Math.round(hashData[inc()] * 255),
        Math.round(hashData[inc()] * 255)
      );
      break;
    case 4:
      colorr = color(
        Math.round(hashData[inc()] * 255),
        Math.round(map(hashData[inc()], 0, 1, 200, 255)),
        Math.round(hashData[inc()] * 255)
      );
      break;
    case 5:
      colorr = color(
        Math.round(hashData[inc()] * 255),
        Math.round(hashData[inc()] * 255),
        Math.round(map(hashData[inc()], 0, 1, 200, 255))
      );
      break;
    case 6:
      colorr = color(
        Math.round(map(hashData[inc()], 0, 1, 50, 255)),
        Math.round(map(hashData[inc()], 0, 1, 50, 255)),
        Math.round(map(hashData[inc()], 0, 1, 50, 255))
      );
      break;
    case 7:
      colorr = color(Math.round(map(hashData[inc()], 0, 1, 50, 255)));
      break;
    case 8:
      colorr = color(ccc1, ccc2, ccc3);
      break;
    case 9:
      colorr = color(rglob, gglob, bglob);
      break;
    default:
      "bull";
  }
  fill(colorr);
};

function drawShape(
  whichShape,
  shapeSequence,
  sequenceLength,
  i,
  pp,
  totalRadius
) {
  switch (whichShape) {
    case 0:
      shapes(0, totalRadius);
      break;
    case 1:
      shapes(1, totalRadius);
      break;
    case 2:
      shapes(2, totalRadius);
      break;
    case 3:
      shapes(3, totalRadius);
      break;
    case 4:
      shapes(4, totalRadius);
      break;
    case 5:
      shapes(5, totalRadius);
      break;
    case 6:
      shapes(6, totalRadius);
      break;
    case 7:
      shapes(7, totalRadius);
      break;
    case 8:
      shapes(8, totalRadius);
      break;
    case 9:
      shapes(shapeSequence[pp % sequenceLength], totalRadius);
      break;
    case 10:
      shapes(shapeSequence[i % sequenceLength], totalRadius);
      break;
    case 11:
      shapes(9, totalRadius);
      break;
    case 12:
      shapes(10, totalRadius);
      break;
    case 13:
      shapes(11, totalRadius);
      break;  
    
    default:
      "wuw";
  }
};

function drawPolygon(corners, totalRadius) {
  let angle = TWO_PI / corners;
  beginShape();
  // let angle = TWO_PI / 7;
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = 0 + cos(a) * (totalRadius / 25);
    let sy = 0 + sin(a) * (totalRadius / 25);
    vertex(sx, sy);
  }
  endShape(CLOSE);
};

function drawStar(radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = cos(a) * radius2;
    let sy = sin(a) * radius2;
    vertex(sx, sy);
    sx = cos(a + halfAngle) * radius1;
    sy = sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
};

function heart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}
function shapes(shape, totalRadius, shuffleBag) {
  let radius2;
  let radius1;

  switch (shape) {
    case 0:
      ellipse(0, 0, totalRadius / 12.5, totalRadius / 12.5);
      break;
    case 1:
      //TRIANGLE
      drawPolygon(3, totalRadius);
      break;
    case 2:
      //RECT
      drawPolygon(4, totalRadius);
      break;
    case 3:
      //BESGEN
      drawPolygon(5, totalRadius);
      break;
    case 4:
      drawPolygon(6, totalRadius);
      break;
      // case 5:
      //   drawPolygon( 7, totalRadius);
      //   break;
      // case 6:
      //   drawPolygon( 8, totalRadius);
      //   break;
    case 5:
      radius2 = totalRadius / 25;
      radius1 = radius2 * 0.4;
      drawStar(radius1, radius2, 3);
      break;
    case 6:
      radius2 = totalRadius / 25;
      radius1 = radius2 * 0.6;
      drawStar(radius1, radius2, 4);
      break;
    case 7:
      radius2 = totalRadius / 25;
      radius1 = radius2 * 0.6;
      drawStar(radius1, radius2, 5);
      break;
    case 8:
      radius2 = totalRadius / 25;
      radius1 = radius2 * 0.6;
      drawStar(radius1, radius2, 12);
      break;
    case 9:
      let a =
        (millis() / 1000) *
        map(hashData[inc()], 0, 1, 0.05, 2);
      switch (floor((a / TWO_PI) % 2)) {
        case 0:
          arc(0, 0, totalRadius / 12.5, totalRadius / 12.5, 0, a, PIE);
          // console.log("0")
          break;
        case 1:
          arc(0, 0, totalRadius / 12.5, totalRadius / 12.5, a, 0, PIE);
          // console.log("1")
          break;
          // case 2:
          //   arc(0, 0, 20, 20, TWO_PI - a, 0);

          //   // console.log("2")
          //   break;
          // case 3:
          //   arc(0, 0, 20, 20, 0, TWO_PI - a);

          // console.log("3")
          // break;
        default:
          "none";
      }
      break;
    case 10:
      triangle(
        map(hashData[inc()], 0, 1, 0, totalRadius / 6.25),
        map(hashData[inc()], 0, 1, 0, totalRadius / 6.25),
        map(hashData[inc()], 0, 1, 0, totalRadius / 6.25),
        map(hashData[inc()], 0, 1, 0, totalRadius / 6.25),
        map(hashData[inc()], 0, 1, 0, totalRadius / 6.25),
        map(hashData[inc()], 0, 1, 0, totalRadius / 6.25)
      );
      break;
    case 11:
      heart(0, 0, totalRadius / 15)
    default:
      "wut";
  }
};

function rotationChoice(
  rotateoption,
  pp,
  i,
  symmetry,
  ang1,
  rot1mul,
  rot2mul,
  globspinphase,
  polarityglob,
  polarity
) {
  switch (rotateoption) {
    case 0:
      // OPTION 0 - ALL FORWARD - SAME SPEED
      rotate(ang1 * 5 + (TWO_PI * i) / symmetry);
      break;
    case 1:
      // OPTION 0 - ALL BACKWARDS - SAME SPEED
      rotate((ang1 * 5 + (TWO_PI * i) / symmetry) * -1);
      break;
    case 2:
      // FORWARDxBACKWARDS - SAME SPEED
      if (pp % 2 === 0) {
        rotate(ang1 + (TWO_PI * i) / symmetry);
      } else {
        rotate((ang1 + (TWO_PI * i) / symmetry) * -1);
      }
      break;
    case 3:
      // BACKWARDSxFORWARD - SAME SPEED
      if (pp % 2 === 0) {
        rotate((ang1 + (TWO_PI * i) / symmetry) * -1);
      } else {
        rotate(ang1 + (TWO_PI * i) / symmetry);
      }
      break;
    case 4:
      // FORWARDxBACKWARDS - WITH SPEED MULTIPLIERS PER ORBIT
      if (pp % 2 === 0) {
        rotate(ang1 * rot1mul + (TWO_PI * i) / symmetry);
      } else {
        rotate((ang1 * rot2mul + (TWO_PI * i) / symmetry) * -1);
      }
      break;
    case 5:
      // BACKWARDSxFORWARD - WITH SPEED MULTIPLIERS PER ORBIT
      if (pp % 2 === 0) {
        rotate((ang1 * rot2mul + (TWO_PI * i) / symmetry) * -1);
      } else {
        rotate(ang1 * rot1mul + (TWO_PI * i) / symmetry);
      }
      break;
    case 6:
      // FORWARD - WITH SPEED MULTIPLIERS PER ORBIT
      rotate(ang1 * rot1mul + (TWO_PI * i) / symmetry);
      break;
    case 7:
      // BACKWARDS - WITH SPEED MULTIPLIERS PER ORBIT
      rotate((ang1 * rot1mul + (TWO_PI * i) / symmetry) * -1);
      break;
    case 8:
      // VARIABLE ROTATION PER ORBIT - SAME SPEED;
      rotate((ang1 + (TWO_PI * i) / symmetry) * polarityglob);
      break;
    case 9:
      // VARIABLE SPEED AND ROTATION PER ORBIT
      rotate((ang1 * rot2mul + (TWO_PI * i) / symmetry) * polarityglob);
      break;
    case 10:
      // FORWARD - PHASING SPEED
      rotate(ang1 * (pp + 1) * globspinphase + (TWO_PI * i) / symmetry);
      break;
    case 11:
      // BACKWARDS - PHASING SPEED
      rotate(
        (ang1 * (pp + 1) * globspinphase + (TWO_PI * i) / symmetry) * -1
      );
      break;
    default:
      "nuttin";
  }
};