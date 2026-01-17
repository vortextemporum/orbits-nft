import chroma from 'chroma-js';

interface Attribute {
  trait_type: string;
  value: string;
}

// Type for chroma brewer palette names
type BrewerPaletteName = keyof typeof chroma.brewer;

// Helper function to map values (same as p5.js map function)
function map(n: number, start1: number, stop1: number, start2: number, stop2: number): number {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

// Convert RGB to hex
function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function getAttributes(hash: string): [Attribute[], Record<string, unknown>] {
  const hashhash = hash.slice(2, 66);
  const hashcombo = hashhash + [...hashhash].reverse().join('');

  const hashPairs: string[] = [];
  for (let j = 0; j < 64; j++) {
    hashPairs.push(hashcombo.slice(0 + j * 2, 2 + j * 2));
  }

  let hashIndex = 0;
  const hashData = hashPairs.map((x) => parseInt(x, 16) / 255);

  const metadataAttributes: Record<string, string> = {};
  const colorlist: string[] = [];
  const rotationDirections: string[] = [];

  function inc(): number {
    hashIndex = (hashIndex + 1) % hashData.length;
    return hashIndex;
  }

  hashIndex = hashData.length - 1;

  const numOrbits = Math.round(map(hashData[inc()], 0, 1, 1, 12));
  const numCircles = Math.round(map(hashData[inc()], 0, 1, 1, 20));

  const circlesinOrbitsArray: number[] = [];
  const symmetryinOrbitsArray: string[] = [];

  const whichRotate = hashData[inc()] * 100;
  let rotateoption: number;

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
  } else {
    rotateoption = 11;
  }

  const rotationMeta: Record<number, string> = {
    0: 'ALL CLOCKWISE',
    1: 'ALL COUNTER CLOCKWISE',
    2: 'CLOCKWISExCOUNTERCLOCKWISE - SAME SPEED',
    3: 'COUNTERCLOCKWISExCLOCKWISE - SAME SPEED',
    4: 'CLOCKWISExCOUNTERCLOCKWISE - VARYING ORBIT SPEED',
    5: 'COUNTERCLOCKWISExCLOCKWISE - VARYING ORBIT SPEED',
    6: 'CLOCKWISE - VARYING ORBIT SPEED',
    7: 'COUNTERCLOCKWISE - VARYING ORBIT SPEED',
    8: 'RANDOM ROTATION - SAME SPEED',
    9: 'RANDOM ROTATION - VARYING ORBIT SPEED',
    10: 'CLOCKWISE - PHASING SPEED',
    11: 'COUNTERCLOCKWISE - PHASING SPEED',
  };

  const areObjectsRotating = hashData[inc()] < 0.5;

  const allcombi = Object.keys(chroma.brewer) as BrewerPaletteName[];
  const selectPallette = Math.floor(hashData[inc()] * allcombi.length);
  const palettename = allcombi[selectPallette];

  const colorMeta: Record<number, string> = {
    0: 'PALETTE - SEQUENTIAL OBJECT',
    1: 'PALETTE - SEQUENTIAL ORBIT',
    2: 'PALETTE - RANDOM',
    3: 'RED DOMINANT',
    4: 'GREEN DOMINANT',
    5: 'BLUE DOMINANT',
    6: 'RGB RNJESUS',
    7: 'GREYSCALE RNJESUS',
    8: 'ORBIT RNJESUS',
    9: 'ONE COLOR THAT RULEZ THEM ALL',
  };

  let pallette = chroma.scale(palettename).mode('lab').colors(numOrbits);

  if (hashData[inc()] < 0.3) {
    for (let i = numOrbits - 1; i > 0; i--) {
      const j = Math.floor(hashData[inc()] * i);
      const temp = pallette[i];
      pallette[i] = pallette[j];
      pallette[j] = temp;
    }
  }

  const colorswitch = hashData[inc()] * 100;
  let colorchoice: number;

  if (colorswitch <= 20) {
    colorchoice = 0;
  } else if (colorswitch <= 40) {
    colorchoice = 1;
  } else if (colorswitch <= 60) {
    pallette = chroma.scale(allcombi[selectPallette] as BrewerPaletteName).mode('lab').colors(30);
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
  } else {
    colorchoice = 9;
  }

  // GLOBAL COLOR VARIABLE FOR OPTION 09
  const rglob = Math.round(map(hashData[inc()], 0, 1, 50, 255));
  const gglob = Math.round(map(hashData[inc()], 0, 1, 50, 255));
  const bglob = Math.round(map(hashData[inc()], 0, 1, 50, 255));

  // SHAPE SELECTOR
  let shapeSequence = [1, 2, 3, 4, 0, 5, 6, 7, 8];
  const shapeSequenceNames: Record<number, string> = {
    1: 'TRIANGLE',
    2: 'SQUARE',
    3: 'PENTAGON',
    4: 'HEXAGON',
    0: 'CIRCLE',
    5: 'STAR1',
    6: 'STAR2',
    7: 'STAR3',
    8: 'STAR4',
  };

  if (hashData[inc()] < 0.5) {
    for (let i = shapeSequence.length - 1; i > 0; i--) {
      const j = Math.floor(hashData[inc()] * i);
      const temp = shapeSequence[i];
      shapeSequence[i] = shapeSequence[j];
      shapeSequence[j] = temp;
    }
  }

  const sequenceLength = Math.floor(map(hashData[inc()], 0, 1, 2, 9));
  const shapeRandom = hashData[inc()] * 100;

  const nameList: string[] = [];
  shapeSequence.slice(0, sequenceLength).forEach((item) => nameList.push(shapeSequenceNames[item]));

  const shapeMeta: Record<number, string> = {
    0: 'CIRCLE',
    1: 'TRIANGLE',
    2: 'RECTANGLE',
    3: 'PENTAGON',
    4: 'HEXAGON',
    5: 'STAR1',
    6: 'STAR2',
    7: 'STAR3',
    8: 'STAR4',
    9: 'SEQORBIT',
    10: 'SEQOBJ',
    11: 'PIE',
    12: 'SEXY TRIANGLE',
    13: 'HEART',
  };

  let whichShapesSelect: number;

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
  } else {
    whichShapesSelect = 13;
  }

  // Process orbits (to match hash consumption pattern of original)
  for (let pp = 0; pp < numOrbits; pp++) {
    let numCircless: number;
    if (hashData[inc()] < 0.5) {
      numCircless = Math.round(map(hashData[inc()], 0, 1, 1, 20));
    } else {
      numCircless = numCircles;
    }

    circlesinOrbitsArray.push(numCircless);

    const coin2 = hashData[inc()];
    symmetryinOrbitsArray.push(coin2 < 0.2 && numCircless < numCircles ? 'no' : 'yes');

    // Consume hash values (matching original pattern)
    hashData[inc()]; // rot1mul
    hashData[inc()]; // rot2mul
    hashData[inc()]; // polarityglob

    const ccc1 = Math.round(map(hashData[inc()], 0, 1, 50, 255));
    const ccc2 = Math.round(map(hashData[inc()], 0, 1, 50, 255));
    const ccc3 = Math.round(map(hashData[inc()], 0, 1, 50, 255));

    for (let i = 0; i < numCircless; i++) {
      let colorr: string;
      switch (colorchoice) {
        case 0:
          colorr = pallette[i % pallette.length];
          break;
        case 1:
          colorr = pallette[pp % pallette.length];
          break;
        case 2:
          colorr = pallette[Math.round(hashData[inc()] * (pallette.length - 1))];
          break;
        case 3:
          colorr = rgbToHex(
            Math.round(map(hashData[inc()], 0, 1, 200, 255)),
            Math.round(hashData[inc()] * 255),
            Math.round(hashData[inc()] * 255)
          );
          break;
        case 4:
          colorr = rgbToHex(
            Math.round(hashData[inc()] * 255),
            Math.round(map(hashData[inc()], 0, 1, 200, 255)),
            Math.round(hashData[inc()] * 255)
          );
          break;
        case 5:
          colorr = rgbToHex(
            Math.round(hashData[inc()] * 255),
            Math.round(hashData[inc()] * 255),
            Math.round(map(hashData[inc()], 0, 1, 200, 255))
          );
          break;
        case 6:
          colorr = rgbToHex(
            Math.round(map(hashData[inc()], 0, 1, 50, 255)),
            Math.round(map(hashData[inc()], 0, 1, 50, 255)),
            Math.round(map(hashData[inc()], 0, 1, 50, 255))
          );
          break;
        case 7: {
          const cccc = Math.round(map(hashData[inc()], 0, 1, 50, 255));
          colorr = rgbToHex(cccc, cccc, cccc);
          break;
        }
        case 8:
          colorr = rgbToHex(ccc1, ccc2, ccc3);
          break;
        case 9:
          colorr = rgbToHex(rglob, gglob, bglob);
          break;
        default:
          colorr = '#000000';
      }
      colorlist.push(colorr);

      hashData[inc()]; // polarity

      if (whichShapesSelect !== 13) {
        if (areObjectsRotating) {
          const rotateWay = 0.5 < hashData[inc()] ? 'cw' : 'ccw';
          rotationDirections.push(rotateWay);
        }
      }

      switch (whichShapesSelect) {
        case 11:
          hashData[inc()];
          break;
        case 12:
          hashData[inc()];
          hashData[inc()];
          hashData[inc()];
          hashData[inc()];
          hashData[inc()];
          hashData[inc()];
          break;
        default:
          break;
      }
    }
  }

  // Build metadata attributes
  metadataAttributes['Creation Hash'] = hash;
  metadataAttributes['Number of Orbits'] = numOrbits.toString();
  metadataAttributes['Coloring'] = colorMeta[colorchoice];

  if (colorchoice === 0 || colorchoice === 1 || colorchoice === 2) {
    metadataAttributes['Palette'] = palettename;
  }

  metadataAttributes['Orbiting Style'] = rotationMeta[rotateoption];
  metadataAttributes['Circles in Orbits'] = circlesinOrbitsArray.join(',');
  metadataAttributes['Symmetry in Orbits'] = symmetryinOrbitsArray.join(',');
  metadataAttributes['Shape'] = shapeMeta[whichShapesSelect];

  if (whichShapesSelect === 9 || whichShapesSelect === 10) {
    metadataAttributes['Shape Sequence'] = nameList.join(', ');
  }

  metadataAttributes['Are Objects Rotating'] = areObjectsRotating ? 'YES' : 'NO';

  if (whichShapesSelect !== 13) {
    if (areObjectsRotating) {
      metadataAttributes['rotations'] = rotationDirections.join(',');
    }
  } else {
    metadataAttributes['Are Objects Rotating'] = 'NO';
  }

  metadataAttributes['color-list'] = colorlist.join(',');

  // Convert to array format
  const features: Attribute[] = [];
  for (const [key, value] of Object.entries(metadataAttributes)) {
    features.push({
      trait_type: key,
      value: value,
    });
  }

  return [features, {}];
}
