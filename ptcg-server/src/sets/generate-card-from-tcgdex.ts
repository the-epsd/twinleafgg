// eslint-disable no-use-before-define
// @ts-nocheck
// Run this script with: npx ts-node ptcg-server/src/sets/generate-card-from-tcgdex.ts <card-id>
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}
const { writeFileSync, mkdirSync, existsSync } = require('fs');
const { join, resolve } = require('path');

//set codes
// wotc era -- base + gym

//base set = base1
//jungle = base2
//fossil = base3
//base set 2 = base4
//team rocket = base5
//gym heroes = gym1
//gym challenge = gym2
//w promptional = wp
//wizards black star promos = basep

// wotc era -- neo

//neo genesis = neo1
//neo discovery = neo2
//neo revelations = neo3
//neo destiny = neo4
//southern islands = si1

// wotc era -- legendary collection + e-series -- lc + ecard

//legendary collection = lc
//expedition = ecard1
//aquapolis = ecard2
//skyridge = ecard3
//best of game = bog
//sample = sp

// ex era -- ex
//ex ruby & sapphire = ex1
//ex sandstorm = ex2
//ex dragon = ex3
//ex team magma vs team aqua = ex4
//ex hidden legends = ex5
//ex firered leafgreen = ex6
//ex team rocket returns = ex7
//ex deoxys = ex8
//ex emerald = ex9
//ex unseen forces = ex10
//ex delta species = ex11
//ex legend maker = ex12
//ex holon phantoms = ex13
//ex crystal guardians = ex14
//ex dragon frontiers = ex15
//ex power keepers = ex16

// diamond & pearl -- dp
//diamond & pearl = dp1
//mysterious treasures = dp2
//secret wonders = dp3
//great encounters = dp4
//majestic dawn = dp5
//legends awakened = dp6
//dp black star promos = dpp

// platinum -- pl
//platinum = pl1
//rising rivals = pl2
//supreme victors = pl3
//arceus = pl4
//pokemon rumble = ru1

// heartgold soulsilver -- hgss
//heartgold soulsilver = hgss1
//unleashed = hgss2
//undaunted = hgss3
//triumphant = hgss4
//heartgold soulsilver black star promos = hgssp

// call of legends series -- col
//call of legends = col1

// black & white -- bw
//black & white = bw1
//emerging powers = bw2
//noble victories = bw3
//next destinies = bw4
//dark explorers = bw5
//dragons exalted = bw6
//dragon vault = dv1
//boundaries crossed = bw7
//plasma storm = bw8
//plasma freeze = bw9
//plasma blast = bw10
//legendary treasures = bw11
//radiant collection = rc
//black star promos = bwp

// Starter mapping from set codes to TCGdex set IDs
const setCodeToTcgDexId = {
  // Sword & Shield
  SSH: 'swsh1', // Sword & Shield Base
  RCL: 'swsh2', // Rebel Clash
  DAA: 'swsh3', // Darkness Ablaze
  CPA: 'swsh35', // Champion's Path
  VIV: 'swsh4', // Vivid Voltage
  BST: 'swsh5', // Battle Styles
  CRE: 'swsh6', // Chilling Reign
  EVS: 'swsh7', // Evolving Skies
  CEL: 'swshcel', // Celebrations
  FST: 'swsh8', // Fusion Strike
  BRS: 'swsh9', // Brilliant Stars
  ASR: 'swsh10', // Astral Radiance
  LOR: 'swsh11', // Lost Origin
  SIT: 'swsh12', // Silver Tempest
  // Scarlet & Violet
  SVI: 'sv1', // Scarlet & Violet Base
  PAL: 'sv2', // Paldea Evolved
  OBF: 'sv3', // Obsidian Flames
};

function parseInputToTcgDexId(input) {
  // If input is already in tcgdex format, return as-is
  if (/^[a-z0-9]+-\d+$/i.test(input)) return input;

  // If input is like 'DAA 135'
  const match = input.match(/^([A-Z]+)\s*(\d+)$/i);
  if (match) {
    const setCode = match[1].toUpperCase();
    const number = match[2];
    const tcgdexSet = setCodeToTcgDexId[setCode];
    if (tcgdexSet) {
      return `${tcgdexSet}-${number}`;
    } else {
      throw new Error(`Unknown set code: ${setCode}`);
    }
  }

  throw new Error('Input must be a TCGdex card ID (e.g., swsh3-135) or a set code and number (e.g., DAA 135)');
}

function toPascalCase(str) {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/(?:^|\s)([a-z])/g, (_, c) => c.toUpperCase())
    .replace(/\s+/g, '');
}

function toKebabCase(str) {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
}

function getSetFolder(setId) {
  if (typeof setId !== 'string') {
    console.warn('Warning: setId is not a string:', setId);
    return 'set-unknown';
  }
  return `set-${setId.toLowerCase()}`;
}

function getBaseClassAndImport(category) {
  if (category === 'Pokemon' || category === 'Pokémon') {
    return { baseClass: 'PokemonCard', importPath: '../../game/store/card/pokemon-card' };
  } else if (category === 'Trainer') {
    return { baseClass: 'TrainerCard', importPath: '../../game/store/card/trainer-card' };
  } else if (category === 'Energy') {
    return { baseClass: 'EnergyCard', importPath: '../../game/store/card/energy-card' };
  }
  throw new Error('Unknown category: ' + category);
}

function mapStage(stage) {
  if (!stage) return '';
  const s = stage.toLowerCase();
  if (s === 'basic') return 'Stage.BASIC';
  if (s === 'stage1' || s === 'stage 1') return 'Stage.STAGE_1';
  if (s === 'stage2' || s === 'stage 2') return 'Stage.STAGE_2';
  if (s === 'vmax') return 'Stage.VMAX';
  if (s === 'ex') return 'Stage.EX';
  return `'${stage}'`;
}

function mapCardType(type) {
  if (!type) return '';
  const t = type.toLowerCase();
  if (t === 'darkness' || t === 'dark') return 'CardType.D';
  if (t === 'colorless') return 'CardType.C';
  if (t === 'fighting') return 'CardType.F';
  if (t === 'grass') return 'CardType.G';
  if (t === 'lightning' || t === 'electric') return 'CardType.L';
  if (t === 'metal' || t === 'steel') return 'CardType.M';
  if (t === 'psychic') return 'CardType.P';
  if (t === 'fire') return 'CardType.R';
  if (t === 'water') return 'CardType.W';
  if (t === 'fairy') return 'CardType.Y';
  if (t === 'dragon') return 'CardType.N';
  return `'${type}'`;
}

function mapCardTypeSymbol(type) {
  if (!type) return '';
  const t = type.toLowerCase();
  if (t === 'darkness' || t === 'dark') return 'D';
  if (t === 'colorless') return 'C';
  if (t === 'fighting') return 'F';
  if (t === 'grass') return 'G';
  if (t === 'lightning' || t === 'electric') return 'L';
  if (t === 'metal' || t === 'steel') return 'M';
  if (t === 'psychic') return 'P';
  if (t === 'fire') return 'R';
  if (t === 'water') return 'W';
  if (t === 'fairy') return 'Y';
  if (t === 'dragon') return 'N';
  return `'${type}'`;
}

function formatCost(costArr) {
  if (!costArr || !costArr.length) return '[]';
  return `[${costArr.map(c => mapCardTypeSymbol(c)).join(', ')}]`;
}

function formatWeaknessesRaw(weakArr) {
  if (!weakArr || !weakArr.length) return '';
  return `  public weakness = [${weakArr.map(w => `{ type: ${mapCardTypeSymbol(w.type)} }`).join(', ')}];\n`;
}

function formatResistancesRaw(resArr) {
  if (!resArr || !resArr.length) return '';
  return `  public resistance = [${resArr.map(r => {
    let str = `{ type: ${mapCardTypeSymbol(r.type)}`;
    if (r.value !== undefined && r.value !== null && r.value !== '') {
      str += `, value: ${typeof r.value === 'string' ? `'${r.value}'` : r.value}`;
    }
    str += ' }';
    return str;
  }).join(', ')}];\n`;
}

function formatPowers(powers) {
  if (!powers || !powers.length) return '[]';
  return '[\n' + powers.map(p =>
    `    {
      name: '${p.name?.en || p.name || ''}',
      powerType: '${p.type || ''}',
      text: '${typeof p.effect === 'string' ? p.effect.replace(/'/g, '\\\'').replace(/\n/g, '\\n') : (p.effect?.en ? p.effect.en.replace(/'/g, '\\\'').replace(/\n/g, '\\n') : '')}'
    }`
  ).join(',\n') + '\n  ]';
}

function escapeSingleQuotes(str) {
  return (str || '').replace(/'/g, '\\\'');
}

function formatAttacksRaw(attacks) {
  if (!attacks || !attacks.length) return '';
  return attacks.map(a => {
    const name = escapeSingleQuotes(a.name?.en || a.name || '');
    const cost = formatCost(a.cost);
    const damage = a.damage ? (isNaN(Number(a.damage)) ? 0 : Number(a.damage)) : 0;
    let text = '';
    if (a.effect) {
      text = typeof a.effect === 'string' ? a.effect : (a.effect?.en || '');
    }
    text = escapeSingleQuotes(text).replace(/\n/g, '\\n');
    return `    {\n      name: '${name}',\n      cost: ${cost},\n      damage: ${damage},\n      text: '${text}'\n    }`;
  }).join(',\n');
}

function getTags(card) {
  const tags = [];
  if (card.stage && card.stage.toLowerCase() !== 'basic') tags.push('CardTag.POKEMON_ex'); // Example, adjust as needed
  // Add more tag logic as needed
  return tags;
}

async function getCardFromArg(arg) {
  if (arg.endsWith('.ts') || arg.endsWith('.js')) {
    console.error('Error: Only TCGdex card IDs are supported. Local file input is not allowed.');
    process.exit(1);
  } else {
    const TCGdex = require('@tcgdex/sdk').default;
    const tcgdex = new TCGdex('en');
    return await tcgdex.card.get(arg);
  }
}

async function main() {
  const input = process.argv.slice(2).join(' ').trim();
  if (!input) {
    console.error('Usage: ts-node ptcg-server/src/sets/generate-card-from-tcgdex.ts <card-id | SETCODE NUMBER>');
    process.exit(1);
  }
  let cardId;
  try {
    cardId = parseInputToTcgDexId(input);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
  const card = await getCardFromArg(cardId);
  if (!card) {
    console.error('Card not found for input:', input);
    process.exit(1);
  }
  const className = toPascalCase(card.name?.en || card.name);
  const fileName = toKebabCase(card.name?.en || card.name) + '.ts';
  const { baseClass, importPath } = getBaseClassAndImport(card.category || card.set?.category);
  const setAbbr = card.set?.abbreviations?.official || card.set?.tcgOnline || (typeof card.set === 'string' ? card.set : undefined);
  const setFolder = getSetFolder(setAbbr);
  const outDir = join(__dirname, setFolder);
  const outFile = join(outDir, fileName);
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  let props = '';
  const tags = getTags(card);
  if (tags.length) {
    props += `  public tags = [${tags.join(', ')}];\n`;
  }
  props += `  public stage: Stage = ${mapStage(card.stage)};\n`;
  if (card.evolveFrom || card.evolvesFrom) {
    props += `  public evolvesFrom = '${escapeSingleQuotes(card.evolveFrom?.en || card.evolveFrom || card.evolvesFrom)}';\n`;
  }
  props += `  public cardType = ${mapCardTypeSymbol((card.cardType || card.types?.[0] || (card.type && card.type[0])))};\n`;
  props += `  public hp: number = ${card.hp || 0};\n`;
  // Weakness
  props += formatWeaknessesRaw(card.weaknesses || card.weakness || []);
  // Resistance
  props += formatResistancesRaw(card.resistances || card.resistance || []);
  // Retreat
  let retreatArr = [];
  if (typeof card.retreat === 'number' && card.retreat > 0) {
    retreatArr = Array(card.retreat).fill('C');
  }
  if (retreatArr.length > 0) props += `  public retreat = [${retreatArr.join(', ')}];\n`;
  // Powers
  const powersStr = formatPowers(card.abilities || card.powers);
  // Attacks (raw)
  const attacksStr = formatAttacksRaw(card.attacks);
  // Insert powers and attacks with correct spacing
  if (powersStr !== '[]' && attacksStr) {
    props += `\n  public powers = ${powersStr};\n\n  public attacks = [\n${attacksStr}\n  ];\n\n`;
  } else if (powersStr !== '[]') {
    props += `\n  public powers = ${powersStr};\n`;
  } else if (attacksStr) {
    props += `\n  public attacks = [\n${attacksStr}\n  ];\n\n`;
  }
  if (card.regulationMark) {
    props += `  public regulationMark = '${card.regulationMark}';\n`;
  }
  props += `  public set: string = '${(setAbbr || '').toUpperCase()}';\n`;
  props += `  public setNumber: string = '${card.setNumber || card.localId || card.number || ''}';\n`;
  props += '  public cardImage: string = \'assets/cardback.png\';\n';
  props += `  public name: string = '${escapeSingleQuotes(card.name?.en || card.name)}';\n`;
  props += `  public fullName: string = '${escapeSingleQuotes(card.name?.en || card.name)} ${(setAbbr || '').toUpperCase()}';\n`;
  let importLines = `import { ${baseClass} } from '${importPath}';\nimport { Stage } from '../../game/store/card/card-types';\n`;
  if (tags.length) {
    importLines += 'import { CardTag } from \'../../game/store/card/card-types\';\n';
  }
  const tsContent = `${importLines}\nexport class ${className} extends ${baseClass} {\n${props}}\n`;
  writeFileSync(outFile, tsContent.trim(), 'utf-8');
  console.log(`Card class saved to ${outFile}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
