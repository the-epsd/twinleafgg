const fs = require('fs');
const ts = require('typescript');

const reprintSetName = 'SVP';
const reprintFolder = 'set-scarlet-and-violet-promos';
const reprintsFileName = 'alt-arts.ts';
const setsFolderPath = './src/sets';
const folders = fs.readdirSync(setsFolderPath).filter(r => !r.includes('.'));
const implemented = readImplementedCards();
const newClassNames = writeReprints();
writeIndex();

function readImplementedCards() {
  /** @type {Record<string, { folder: string, file: string, className: string, setName: string, setNumber: string, cardName: string | undefined }} */
  const result = {};

  for (const folder of folders) {
    for (const file of fs.readdirSync(`${setsFolderPath}/${folder}`)) {

      const content = fs.readFileSync(`${setsFolderPath}/${folder}/${file}`, 'utf-8');
      const sourceFile = ts.createSourceFile('file.ts', content, ts.ScriptTarget.ESNext, true);

      /** @type {ts.Visitor} */
      const visitor = (node) => {
        if (ts.isClassDeclaration(node)) {
          const className = node.name?.text;
          const setNumber = node.members.find(m => m.name?.text === 'setNumber')?.initializer?.text;
          const setName = node.members.find(m => m.name?.text === 'set')?.initializer?.text;
          const cardName = node.members.find(m => m.name?.text === 'name')?.initializer?.text;

          if (className && setName && setNumber)
            result[`${setName}/${setNumber}`] = { folder, file, className, cardName, setName, setNumber };
        }

        ts.forEachChild(node, visitor);
      }

      ts.visitNode(sourceFile, visitor);
    }
  }

  return result;
}

function writeReprints() {
  const newImports = [];
  const newCards = [];
  const _newClassNames = [];
  const importReplacements = [];
  const exportReplacements = [];

  for (const [reprintNumber, cardInfo] of Object.entries(mapping())) {
    if (implemented[`${reprintSetName}/${reprintNumber}`])
      continue;

    let { name, suffix, reprints } = cardInfo;
    const implementations = reprints.map(reprint => implemented[reprint]).filter(Boolean);
    if (!implementations.length)
      continue;

    // Prefer original implementation if available
    const implementation = implementations.find(imp => imp.cardName) || implementations[0];

    suffix = suffix || '';
    const baseClassName = implementation.className + (suffix ? implementation.setName + implementation.setNumber : '');
    const newClassName = implementation.className + reprintSetName + suffix;
    const cardName = implementation.cardName || escapeQuotes(name);
    const fullName = `${cardName}${suffix} ${reprintSetName}`;
    newImports.push(`import { ${implementation.className}${suffix ? ' as ' + baseClassName : ''} } from "../${implementation.folder}/${removeTsExtension(implementation.file)}";`);
    newCards.push(...[
      `export class ${newClassName} extends ${baseClassName} {`,
      `  public setNumber = '${reprintNumber}';`,
      `  public fullName: string = '${fullName}';`,
      `  public set = '${reprintSetName}';`,
      `}`,
      '',
    ]);
    _newClassNames.push(newClassName);

    if (suffix) {
      const realName = `${cardName} ${reprintSetName}`;
      importReplacements.push(`  { from: '${realName}', to: '${fullName}' },`);
      exportReplacements.push(`  { from: '${fullName}', to: '${realName}' },`);
    }
  }

  if (newCards.length) {
    const outputFileName = `${setsFolderPath}/${reprintFolder}/${reprintsFileName}`;
    const lines = fs.existsSync(outputFileName)
      ? fs.readFileSync(outputFileName, 'utf-8').split('\n')
      : [];

    fs.writeFileSync(outputFileName, [
      ...distinct(newImports),
      ...lines,
      ...newCards
    ].join('\n'));
  }

  if (importReplacements.length) {
    const outputFileName = `../ptcg-play/src/app/deck/deck-edit/card-replacements.ts`;
    const lines = fs.readFileSync(outputFileName, 'utf-8').split('\n');
    let trimmedLines = lines.map(line => line.trim());
    const importReplacementsIndex = trimmedLines.indexOf('];');
    if (importReplacementsIndex > -1)
      lines.splice(importReplacementsIndex, 0, ...importReplacements);

    trimmedLines = lines.map(line => line.trim());
    const exportReplacementsIndex = trimmedLines.lastIndexOf('];');
    if (exportReplacementsIndex > -1)
      lines.splice(exportReplacementsIndex, 0, ...exportReplacements);

    fs.writeFileSync(outputFileName, lines.join('\n'));
  }

  return _newClassNames;
}

function writeIndex() {
  const indexFileName = `${setsFolderPath}/${reprintFolder}/index.ts`;
  const indexLines = fs.readFileSync(indexFileName, 'utf-8').split('\n');
  const newIndexImportLine = `import { ${newClassNames.join(', ')} } from './${removeTsExtension(reprintsFileName)}';`;
  const newIndexCards = newClassNames.map(c => `  new ${c}(),`);
  const lastIndexLine = indexLines.indexOf('];');
  if (lastIndexLine > -1)
    indexLines.splice(lastIndexLine, 0, ...newIndexCards);
  fs.writeFileSync(indexFileName, [
    newIndexImportLine,
    ...indexLines
  ].join('\n'));
}

function distinct(array) {
  return Array.from(new Set(array));
}

/** @param {string} value */
function escapeQuotes(value) {
  return value.replace(/'/g, "\\'");
}

/** @param {string} fileName */
function removeTsExtension(fileName) {
  return fileName.replace('.ts', '')
}

// Run on https://limitlesstcg.com/cards/SVP?display=full
// (function(){
//     let cards = {};
//     let allNames = Array.from(document.querySelectorAll('.card-page-main .card-text-name'), x => x.innerText);
//     Array.from(document.querySelectorAll('.card-page-main')).forEach((e, index) => {
//         let name = e.querySelector('.card-text-name').innerText;
//         let occurenceCount = allNames.slice(0, index).filter(n => n === name).length;
//         let suffix = occurenceCount ? occurenceCount + 1 : '';
//         let cardNumber = e.querySelector('.card-text-name a').pathname.split('/').at(-1);
//         let reprints = Array
//           .from(e.querySelectorAll('.card-prints-versions a[href^="/cards/"]'))
//           .filter(x => !x.pathname.includes('/jp/'))
//           .map(x => x.pathname.split('/').slice(-2).join('/'));

//         if (reprints.length) {
//             let card = { name, reprints };
//             if (suffix)
//                 card.suffix = suffix;

//             cards[cardNumber] = card;
//         }
//      });
//      return cards;
//  })()
// 

function mapping() {
  return {
    "5": {
      "name": "Quaquaval",
      "reprints": [
        "SVI/54"
      ]
    },
    "6": {
      "name": "Pawmot",
      "reprints": [
        "SVI/209",
        "SVI/76",
        "PAF/144"
      ]
    },
    "7": {
      "name": "Hawlucha",
      "reprints": [
        "SVI/118",
        "PAF/175"
      ]
    },
    "8": {
      "name": "Revavroom",
      "reprints": [
        "SVI/142",
        "PAF/65",
        "PAF/193"
      ]
    },
    "13": {
      "name": "Miraidon",
      "reprints": [
        "SVI/80"
      ]
    },
    "14": {
      "name": "Koraidon",
      "reprints": [
        "SVI/124"
      ]
    },
    "19": {
      "name": "Baxcalibur",
      "reprints": [
        "PAL/210",
        "PAL/60",
        "PAF/130"
      ]
    },
    "20": {
      "name": "Tinkaton",
      "reprints": [
        "PAL/105",
        "PAF/167"
      ]
    },
    "21": {
      "name": "Murkrow",
      "reprints": [
        "PAL/131",
        "PAF/181"
      ]
    },
    "22": {
      "name": "Pelipper",
      "reprints": [
        "PAL/159",
        "PAF/204"
      ]
    },
    "23": {
      "name": "Smoliv",
      "reprints": [
        "SVI/21",
        "PAF/102"
      ]
    },
    "24": {
      "name": "Growlithe",
      "reprints": [
        "SVI/31"
      ]
    },
    "26": {
      "name": "Varoom",
      "reprints": [
        "SVI/140"
      ]
    },
    "28": {
      "name": "Miraidon ex",
      "reprints": [
        "SVI/253",
        "SVI/244",
        "SVI/227",
        "SVI/81",
        "PAF/243"
      ]
    },
    "29": {
      "name": "Koraidon ex",
      "reprints": [
        "SVI/254",
        "SVI/247",
        "SVI/231",
        "SVI/125",
        "PAF/245"
      ]
    },
    "30": {
      "name": "Chien-Pao ex",
      "reprints": [
        "PAL/61",
        "PAL/274",
        "PAL/261",
        "PAL/236",
        "PAF/242"
      ]
    },
    "31": {
      "name": "Tinkaton ex",
      "reprints": [
        "PAL/262",
        "PAL/240"
      ]
    },
    "32": {
      "name": "Annihilape ex",
      "reprints": [
        "PAL/242"
      ]
    },
    "33": {
      "name": "Meowscarada ex",
      "reprints": [
        "SVP/78",
        "PAL/15",
        "PAL/271",
        "PAL/256",
        "PAL/231"
      ]
    },
    "34": {
      "name": "Skeledirge ex",
      "reprints": [
        "SVP/81",
        "PAL/272",
        "PAL/258",
        "PAL/233",
        "PAL/37"
      ]
    },
    "35": {
      "name": "Quaquaval ex",
      "reprints": [
        "SVP/84",
        "PAL/52",
        "PAL/273",
        "PAL/260",
        "PAL/235"
      ]
    },
    "36": {
      "name": "Palafin",
      "reprints": [
        "OBF/200",
        "OBF/62",
        "PAF/124",
        "PAF/225"
      ]
    },
    "37": {
      "name": "Cleffa",
      "reprints": [
        "OBF/80",
        "OBF/202",
        "PAF/150"
      ]
    },
    "38": {
      "name": "Togekiss",
      "reprints": [
        "OBF/85"
      ]
    },
    "39": {
      "name": "Mawile",
      "reprints": [
        "OBF/143"
      ]
    },
    "44": {
      "name": "Charmander",
      "reprints": [
        "OBF/26"
      ]
    },
    "45": {
      "name": "Paradise Resort",
      "reprints": [
        "SVP/150"
      ]
    },
    "49": {
      "name": "Zapdos ex",
      "reprints": [
        "MEW/202",
        "MEW/192",
        "MEW/145"
      ]
    },
    "50": {
      "name": "Alakazam ex",
      "reprints": [
        "MEW/201",
        "MEW/188",
        "MEW/65",
        "PAF/215"
      ]
    },
    "51": {
      "name": "Snorlax",
      "reprints": [
        "MEW/143",
        "PAF/202"
      ]
    },
    "52": {
      "name": "Mewtwo",
      "reprints": [
        "MEW/150"
      ]
    },
    "53": {
      "name": "Mew ex",
      "reprints": [
        "MEW/205",
        "MEW/193",
        "MEW/151",
        "PAF/216",
        "PAF/232"
      ]
    },
    "54": {
      "name": "Greninja ex",
      "reprints": [
        "SVP/132"
      ]
    },
    "55": {
      "name": "Kangaskhan ex",
      "reprints": [
        "MEW/190",
        "MEW/115"
      ]
    },
    "56": {
      "name": "Charizard ex",
      "reprints": [
        "SVP/74",
        "OBF/215",
        "OBF/125",
        "OBF/228",
        "OBF/223",
        "PAF/234",
        "PAF/54"
      ]
    },
    "57": {
      "name": "Chi-Yu",
      "reprints": [
        "PAR/29"
      ]
    },
    "58": {
      "name": "Iron Bundle",
      "reprints": [
        "SVP/66",
        "PAR/56"
      ]
    },
    "59": {
      "name": "Xatu",
      "reprints": [
        "PAR/72",
        "PAF/152",
        "PAF/26"
      ]
    },
    "60": {
      "name": "Aegislash",
      "reprints": [
        "PAR/210",
        "PAR/134"
      ]
    },
    "61": {
      "name": "Pineco",
      "reprints": [
        "PAL/4",
        "PAF/99",
        "PAF/1"
      ]
    },
    "62": {
      "name": "Sinistea",
      "reprints": [
        "OBF/97"
      ]
    },
    "64": {
      "name": "Arctibax",
      "reprints": [
        "PAL/209",
        "PAL/59",
        "PAF/129"
      ]
    },
    "65": {
      "name": "Scream Tail",
      "reprints": [
        "PAR/86",
        "PRE/42"
      ]
    },
    "66": {
      "name": "Iron Bundle",
      "reprints": [
        "SVP/58",
        "PAR/56"
      ],
      "suffix": 2
    },
    "67": {
      "name": "Roaring Moon ex",
      "reprints": [
        "PAR/229",
        "PAR/124",
        "PAR/262",
        "PAR/251",
        "PRE/162"
      ]
    },
    "68": {
      "name": "Iron Valiant ex",
      "reprints": [
        "PAR/261",
        "PAR/249",
        "PAR/225",
        "PAR/89",
        "PRE/157"
      ]
    },
    "69": {
      "name": "Fidough",
      "reprints": [
        "SVI/97",
        "PAF/38"
      ]
    },
    "70": {
      "name": "Greavard",
      "reprints": [
        "SVI/214",
        "SVI/104",
        "PAF/42"
      ]
    },
    "71": {
      "name": "Maschiff",
      "reprints": [
        "PAL/141",
        "PAF/62"
      ]
    },
    "72": {
      "name": "Great Tusk ex",
      "reprints": [
        "PAF/53"
      ]
    },
    "73": {
      "name": "Iron Treads ex",
      "reprints": [
        "PAF/66"
      ]
    },
    "74": {
      "name": "Charizard ex",
      "reprints": [
        "SVP/56",
        "OBF/215",
        "OBF/125",
        "OBF/228",
        "OBF/223",
        "PAF/234",
        "PAF/54"
      ],
      "suffix": 2
    },
    "75": {
      "name": "Mimikyu",
      "reprints": [
        "PAL/97",
        "PAF/160",
        "PAF/37"
      ]
    },
    "76": {
      "name": "Sprigatito",
      "reprints": [
        "PAL/196",
        "PAL/12"
      ],
      "suffix": 2
    },
    "77": {
      "name": "Floragato",
      "reprints": [
        "PAL/197",
        "PAL/14"
      ]
    },
    "78": {
      "name": "Meowscarada ex",
      "reprints": [
        "SVP/33",
        "PAL/15",
        "PAL/271",
        "PAL/256",
        "PAL/231"
      ],
      "suffix": 2
    },
    "79": {
      "name": "Fuecoco",
      "reprints": [
        "PAL/34"
      ],
      "suffix": 2
    },
    "80": {
      "name": "Crocalor",
      "reprints": [
        "PAL/36",
        "PAL/202"
      ]
    },
    "81": {
      "name": "Skeledirge ex",
      "reprints": [
        "SVP/34",
        "PAL/272",
        "PAL/258",
        "PAL/233",
        "PAL/37"
      ],
      "suffix": 2
    },
    "82": {
      "name": "Quaxly",
      "reprints": [
        "PAL/50"
      ],
      "suffix": 2
    },
    "83": {
      "name": "Quaxwell",
      "reprints": [
        "PAL/207",
        "PAL/51"
      ]
    },
    "84": {
      "name": "Quaquaval ex",
      "reprints": [
        "SVP/35",
        "PAL/52",
        "PAL/273",
        "PAL/260",
        "PAL/235"
      ],
      "suffix": 2
    },
    "88": {
      "name": "Pikachu",
      "reprints": [
        "PAL/62",
        "PAF/131",
        "PAF/18"
      ],
      "suffix": 2
    },
    "89": {
      "name": "Feraligatr",
      "reprints": [
        "TEF/41"
      ]
    },
    "90": {
      "name": "Metang",
      "reprints": [
        "TEF/114"
      ]
    },
    "91": {
      "name": "Koraidon",
      "reprints": [
        "TEF/119"
      ],
      "suffix": 2
    },
    "92": {
      "name": "Miraidon",
      "reprints": [
        "TEF/121"
      ],
      "suffix": 2
    },
    "93": {
      "name": "Carvanha",
      "reprints": [
        "OBF/46"
      ]
    },
    "97": {
      "name": "Flutter Mane",
      "reprints": [
        "TEF/78",
        "PRE/43"
      ]
    },
    "98": {
      "name": "Iron Thorns",
      "reprints": [
        "TEF/62"
      ]
    },
    "103": {
      "name": "Houndoom ex",
      "reprints": [
        "OBF/134"
      ]
    },
    "104": {
      "name": "Melmetal ex",
      "reprints": [
        "OBF/153"
      ]
    },
    "115": {
      "name": "Thwackey",
      "reprints": [
        "TWM/15"
      ]
    },
    "116": {
      "name": "Infernape",
      "reprints": [
        "TWM/173",
        "TWM/33"
      ]
    },
    "117": {
      "name": "Froslass",
      "reprints": [
        "TWM/174",
        "TWM/53"
      ]
    },
    "118": {
      "name": "Tatsugiri",
      "reprints": [
        "TWM/186",
        "TWM/131"
      ]
    },
    "119": {
      "name": "Toxel",
      "reprints": [
        "OBF/71",
        "PAF/140"
      ]
    },
    "120": {
      "name": "Pupitar",
      "reprints": [
        "OBF/106"
      ]
    },
    "123": {
      "name": "Teal Mask Ogerpon",
      "reprints": [
        "TWM/24"
      ]
    },
    "124": {
      "name": "Iono",
      "reprints": [
        "PAL/254",
        "PAL/185",
        "PAL/269",
        "PAF/80",
        "PAF/237"
      ]
    },
    "125": {
      "name": "Armarouge ex",
      "reprints": [
        "PAR/218",
        "PAR/27"
      ],
      "suffix": 2
    },
    "126": {
      "name": "Palafin ex",
      "reprints": [
        "TWM/61",
        "TWM/193",
        "PRE/151"
      ]
    },
    "127": {
      "name": "Walking Wake ex",
      "reprints": [
        "TEF/189",
        "TEF/50",
        "TEF/215",
        "TEF/205",
        "PRE/178"
      ]
    },
    "128": {
      "name": "Iron Leaves ex",
      "reprints": [
        "TEF/203",
        "TEF/186",
        "TEF/25",
        "TEF/213",
        "PRE/176"
      ]
    },
    "129": {
      "name": "Pecharunt",
      "reprints": [
        "SVP/149"
      ]
    },
    "130": {
      "name": "Kingambit",
      "reprints": [
        "OBF/150"
      ],
      "suffix": 2
    },
    "131": {
      "name": "Kingdra ex",
      "reprints": [
        "SFA/80",
        "SFA/12"
      ]
    },
    "132": {
      "name": "Greninja ex",
      "reprints": [
        "SVP/54"
      ],
      "suffix": 2
    },
    "133": {
      "name": "Ledian",
      "reprints": [
        "SCR/144",
        "SCR/3"
      ]
    },
    "134": {
      "name": "Crabominable",
      "reprints": [
        "SCR/42",
        "SCR/149"
      ]
    },
    "135": {
      "name": "Drifblim",
      "reprints": [
        "SCR/61"
      ]
    },
    "136": {
      "name": "Bouffalant",
      "reprints": [
        "SCR/119"
      ]
    },
    "137": {
      "name": "Horsea",
      "reprints": [
        "PAR/30"
      ]
    },
    "138": {
      "name": "Porygon2",
      "reprints": [
        "PAR/143"
      ]
    },
    "141": {
      "name": "Noctowl",
      "reprints": [
        "SCR/115",
        "PRE/78"
      ]
    },
    "142": {
      "name": "Victini ex",
      "reprints": [
        "OBF/33"
      ]
    },
    "143": {
      "name": "Miraidon ex",
      "reprints": [
        "OBF/79"
      ],
      "suffix": 2
    },
    "144": {
      "name": "Gouging Fire ex",
      "reprints": [
        "TEF/214",
        "TEF/204",
        "TEF/188",
        "TEF/38"
      ]
    },
    "145": {
      "name": "Raging Bolt ex",
      "reprints": [
        "TEF/123",
        "TEF/218",
        "TEF/208",
        "TEF/196",
        "PRE/166"
      ]
    },
    "146": {
      "name": "Iron Crown ex",
      "reprints": [
        "TEF/191",
        "TEF/81",
        "TEF/216",
        "TEF/206",
        "PRE/158"
      ]
    },
    "147": {
      "name": "Iron Boulder ex",
      "reprints": [
        "TEF/217",
        "TEF/207",
        "TEF/192",
        "TEF/99"
      ]
    },
    "149": {
      "name": "Pecharunt",
      "reprints": [
        "SVP/129"
      ],
      "suffix": 2
    },
    "150": {
      "name": "Paradise Resort",
      "reprints": [
        "SVP/45"
      ],
      "suffix": 2
    },
    "151": {
      "name": "Gouging Fire",
      "reprints": [
        "SSP/38"
      ]
    },
    "152": {
      "name": "Chien-Pao",
      "reprints": [
        "SSP/56"
      ]
    },
    "153": {
      "name": "Magneton",
      "reprints": [
        "SVP/159",
        "SSP/59"
      ]
    },
    "154": {
      "name": "Indeedee",
      "reprints": [
        "SSP/93"
      ]
    },
    "159": {
      "name": "Magneton",
      "reprints": [
        "SVP/153",
        "SSP/59"
      ],
      "suffix": 2
    },
    "160": {
      "name": "Squawkabilly ex",
      "reprints": [
        "PAL/264",
        "PAL/247",
        "PAL/169",
        "PAF/223",
        "PAF/75"
      ]
    },
    "161": {
      "name": "Charizard ex",
      "reprints": [
        "MEW/199",
        "MEW/183",
        "MEW/6"
      ],
      "suffix": 3
    },
    "163": {
      "name": "Cinderace ex",
      "reprints": [
        "SCR/157",
        "SCR/28"
      ]
    },
    "164": {
      "name": "Lapras ex",
      "reprints": [
        "SCR/158",
        "SCR/32"
      ]
    },
    "165": {
      "name": "Terapagos ex",
      "reprints": [
        "SCR/173",
        "SCR/170",
        "SCR/128",
        "PRE/180",
        "PRE/169",
        "PRE/92"
      ]
    },
    "166": {
      "name": "Teal Mask Ogerpon ex",
      "reprints": [
        "TWM/25",
        "TWM/221",
        "TWM/211",
        "TWM/190",
        "PRE/177",
        "PRE/145",
        "PRE/12"
      ]
    },
    "177": {
      "name": "Bloodmoon Ursaluna ex",
      "reprints": [
        "TWM/202",
        "TWM/141",
        "TWM/222",
        "TWM/216",
        "PRE/168"
      ]
    }
  }
}
