const chroma = require("./chroma.min.js")

// const genRanHex = size => "0x" + [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

// let randHash = genRanHex(64)

// let tokenData = {
//   // hash: "0x75da5733dab25ceb69059dc2adfde1dea932dccff3d63e363a6614a7754e9d6f",
//   hash: randHash,
// }

module.exports = function getAttributes(hash) {
  let hashhash = hash.slice(2, 66)

  const hashcombo = hashhash + [...hashhash].reverse().join('')

  let hashPairs = [];

  for (let j = 0; j < 64; j++) {
    hashPairs.push(hashcombo.slice(0 + (j * 2), 2 + (j * 2)));
  }

  let hashIndex = 0


  let hashData = hashPairs.map(x => {
    return parseInt(x, 16) / 255;
  });


  // console.log(chroma.brewer)

  let metadataAttributes = {}



  let colorlist = []
  let rotationDirections = []

  function map(n, start1, stop1, start2, stop2, withinBounds) {
    var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    if (!withinBounds) {
      return newval;
    }
    if (start2 < stop2) {
      return this.constrain(newval, start2, stop2);
    } else {
      return this.constrain(newval, stop2, start2);
    }
  }

  function componentToHex(c) {
    // console.log(c)
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  const rgbtohex = (r, g, b) => {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  function inc() {
    hashIndex = (hashIndex + 1) % hashData.length;
    return hashIndex
  }


  hashIndex = hashData.length - 1

  // let totalRadius = 250;
  let numOrbits = Math.round(map(hashData[inc()], 0, 1, 1, 12));
  // let numOrbits = 6;
  let numCircles = Math.round(map(hashData[inc()], 0, 1, 1, 20));

  let circlesinOrbitsArray = [];
  let symmetryinOrbitsArray = [];
  // hashData[inc()]
  let globspinphase = 1;
  var ang1;


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

  let rotationMeta = {
    0: "ALL CLOCKWISE",
    1: "ALL COUNTER CLOCKWISE",
    2: "CLOCKWISExCOUNTERCLOCKWISE - SAME SPEED",
    3: "COUNTERCLOCKWISExCLOCKWISE - SAME SPEED",
    4: "CLOCKWISExCOUNTERCLOCKWISE - VARYING ORBIT SPEED",
    5: "COUNTERCLOCKWISExCLOCKWISE - VARYING ORBIT SPEED",
    6: "CLOCKWISE - VARYING ORBIT SPEED",
    7: "COUNTERCLOCKWISE - VARYING ORBIT SPEED",
    8: "RANDOM ROTATION - SAME SPEED",
    9: "RANDOM ROTATION - VARYING ORBIT SPEED",
    10: "CLOCKWISE - PHASING SPEED",
    11: "COUNTERCLOCKWISE - PHASING SPEED"
  }

  const areObjectsRotating = hashData[inc()] < 0.5;

  let allcombi = Object.keys(chroma.brewer);

  let selectPallette = Math.floor(
    (hashData[inc()]) * (allcombi.length)
  );

  let palettename = allcombi[selectPallette]
  let colorMeta = {
    0: "PALETTE - SEQUENTIAL OBJECT",
    1: "PALETTE - SEQUENTIAL ORBIT",
    2: "PALETTE - RANDOM",
    3: "RED DOMINANT",
    4: "GREEN DOMINANT",
    5: "BLUE DOMINANT",
    6: "RGB RNJESUS",
    7: "GREYSCALE RNJESUS",
    8: "ORBIT RNJESUS",
    9: "ONE COLOR THAT RULEZ THEM ALL",
  }


  let pallette = chroma
    .scale(palettename)
    .mode("lab")
    .colors(numOrbits);

  // console.log(pallette)

  if (hashData[inc()] < 0.3) {
    for (let i = numOrbits - 1; i > 0; i--) {
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
    1: "TRIANGLE",
    2: "SQUARE",
    3: "PENTAGON",
    4: "HEXAGON",
    0: "CIRCLE",
    5: "STAR1",
    6: "STAR2",
    7: "STAR3",
    8: "STAR4"
  };
  if (hashData[inc()] < 0.5) {
    for (let i = shapeSequence.length - 1; i > 0; i--) {
      const j = Math.floor(hashData[inc()] * i);
      const temp = shapeSequence[i];
      shapeSequence[i] = shapeSequence[j];
      shapeSequence[j] = temp;
    }
  }

  let sequenceLength = Math.floor(
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

  // console.log(nameList)


  let shapeMeta = {
    0: "CIRCLE",
    1: "TRIANGLE",
    2: "RECTANGLE",
    3: "PENTAGON",
    4: "HEXAGON",
    5: "STAR1",
    6: "STAR2",
    7: "STAR3",
    8: "STAR4",
    9: "SEQORBIT",
    10: "SEQOBJ",
    11: "PIE",
    12: "SEXY TRIANGLE",
    13: "HEART",
  }
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
  } else if (shapeRandom <= 97) {
    whichShapesSelect = 11;
  } else if (shapeRandom <= 99) {
    whichShapesSelect = 12;
  } else if (shapeRandom <= 100) {
    whichShapesSelect = 13
  }


  for (let pp = 0; pp < numOrbits; pp++) {


    let numCircless;
    hashData[inc()] < 0.5 ?
      (numCircless = Math.round(
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

    symmetryinOrbitsArray.push(coin2 < 0.2 && numCircless < numCircles ? "no" : "yes");



    let rot1mul = map(hashData[inc()], 0, 1, 0.1, 10);
    let rot2mul = map(hashData[inc()], 0, 1, 0.1, 10);
    let polarityglob = Math.round(hashData[inc()]) * 2 - 1;

    let ccc1 = Math.round(map(hashData[inc()], 0, 1, 50, 255));
    let ccc2 = Math.round(map(hashData[inc()], 0, 1, 50, 255));
    let ccc3 = Math.round(map(hashData[inc()], 0, 1, 50, 255));

    for (let i = 0; i < numCircless; i++) {

      let colorr;
      switch (colorchoice) {
        case 0:
          colorr = pallette[i % pallette.length];
          break;
        case 1:
          colorr = pallette[pp % pallette.length];
          break;
        case 2:
          colorr = pallette[Math.round(hashData[inc()] * (pallette.length - 1))]
          break;
        case 3:
          colorr = rgbtohex(
            Math.round(map(hashData[inc()], 0, 1, 200, 255)),
            Math.round(hashData[inc()] * 255),
            Math.round(hashData[inc()] * 255)
          );
          break;
        case 4:
          colorr = rgbtohex(
            Math.round(hashData[inc()] * 255),
            Math.round(map(hashData[inc()], 0, 1, 200, 255)),
            Math.round(hashData[inc()] * 255)
          );
          break;
        case 5:
          colorr = rgbtohex(
            Math.round(hashData[inc()] * 255),
            Math.round(hashData[inc()] * 255),
            Math.round(map(hashData[inc()], 0, 1, 200, 255))
          );
          break;
        case 6:
          colorr = rgbtohex(
            Math.round(map(hashData[inc()], 0, 1, 50, 255)),
            Math.round(map(hashData[inc()], 0, 1, 50, 255)),
            Math.round(map(hashData[inc()], 0, 1, 50, 255))
          );
          break;
        case 7:
          let cccc = Math.round(map(hashData[inc()], 0, 1, 50, 255))
          colorr = rgbtohex(cccc, cccc, cccc);
          break;
        case 8:
          colorr = rgbtohex(ccc1, ccc2, ccc3);
          break;
        case 9:
          colorr = rgbtohex(rglob, gglob, bglob);
          break;
        default:
          "bull";
      }
      colorlist.push(colorr)

      let polarity = Math.round(hashData[inc()]) * 2 - 1;

      if (whichShapesSelect != 13) {
        if (areObjectsRotating) {
          let rotateWay = (0.5 < hashData[inc()]) ? "cw" : "ccw"
          rotationDirections.push(rotateWay)
        }
      }

      switch (whichShapesSelect) {
        case 11:
          hashData[inc()]
          break;
        case 12:
          hashData[inc()]
          hashData[inc()]
          hashData[inc()]
          hashData[inc()]
          hashData[inc()]
          hashData[inc()]
          break;
        default:
          "wuw";
      }


    }
  }

  metadataAttributes["Creation Hash"] = hash

  metadataAttributes["Number of Orbits"] = numOrbits.toString()
  metadataAttributes["Coloring"] = colorMeta[colorchoice]

  if (colorchoice == 0 || colorchoice == 1 || colorchoice == 2) {
    metadataAttributes["Palette"] = palettename
  }

  metadataAttributes["Orbiting Style"] = rotationMeta[rotateoption]


  metadataAttributes["Circles in Orbits"] = circlesinOrbitsArray.join(",")
  metadataAttributes["Symmetry in Orbits"] = symmetryinOrbitsArray.join(",")
  metadataAttributes["Shape"] = shapeMeta[whichShapesSelect]

  if (whichShapesSelect === 9 || whichShapesSelect === 10) {

    metadataAttributes["Shape Sequence"] = nameList.join(", ")
  }

  


  const features = []
  let extraInformation = {};

  metadataAttributes["Are Objects Rotating"] = (areObjectsRotating) ? "YES" : "NO"

  if (whichShapesSelect != 13) {
    if (areObjectsRotating) {
      extraInformation["rotations"] = rotationDirections
    }
  } else {
    metadataAttributes["Are Objects Rotating"] = "NO"
  }

  extraInformation["color-list"] = colorlist.join(",")


  for (const [key, value] of Object.entries(metadataAttributes)) {
    features.push({
      "trait_name": key,
      "value": value
    })
  }

  //   const features = JSON.stringify(metadataAttributes)

  return [features, extraInformation]
}


// console.log(metadataAttributes)
// console.log(calculateFeatures())

