import * as fs from 'fs';
import * as path from 'path';

import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Card } from '../../game/store/card/card';

const setsDir = path.resolve(__dirname, '..');
const EXPORT_PATH_REGEX = /export \* from '\.\/([^']+)'/g;
const IMPORT_PATH_REGEX = /from '\.\/([^']+)'/g;
const SET_DECLARATION_REGEX = /public set(?:\s*:\s*string)?\s*=\s*['"]([^'"]+)['"]/;
const SET_CODE_REGEX = /^[A-Z0-9-]{2,8}$/;

let setCodeToModules: Map<string, string[]> | undefined;
const loadedSetModules = new Set<string>();
let allCardsRegistered = false;

function updateKnownCards(): void {
  StateSerializer.setKnownCards(CardManager.getInstance().getAllCards());
}

function defineSet(cards: Card[]): void {
  const cardManager = CardManager.getInstance();
  if (cards.length > 0 && cards.every(card => cardManager.isCardDefined(card.fullName))) {
    return;
  }
  try {
    cardManager.defineSet(cards);
  } catch (error: any) {
    if (!error.message?.startsWith('Multiple cards with the same name')) {
      throw error;
    }
  }
}

function getExportedSetModulePaths(): string[] {
  const indexContent = fs.readFileSync(path.join(setsDir, 'index.ts'), 'utf8');
  const modulePaths: string[] = [];
  EXPORT_PATH_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = EXPORT_PATH_REGEX.exec(indexContent)) !== null) {
    modulePaths.push(match[1]);
  }
  return modulePaths;
}

function extractSetCodeFromSource(source: string): string | undefined {
  const match = SET_DECLARATION_REGEX.exec(source);
  if (!match) {
    return undefined;
  }
  const setCode = match[1].toUpperCase();
  return SET_CODE_REGEX.test(setCode) ? setCode : undefined;
}

function inferSetCodeFromModule(moduleName: string): string | undefined {
  const moduleDir = path.join(setsDir, moduleName);
  const indexPath = path.join(moduleDir, 'index.ts');
  if (!fs.existsSync(indexPath)) {
    return undefined;
  }

  const indexContent = fs.readFileSync(indexPath, 'utf8');
  const candidateFiles: string[] = [];
  IMPORT_PATH_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = IMPORT_PATH_REGEX.exec(indexContent)) !== null) {
    candidateFiles.push(path.join(moduleDir, `${match[1]}.ts`));
  }

  const fallbackFiles = fs.readdirSync(moduleDir)
    .filter(file => file.endsWith('.ts') && file !== 'index.ts')
    .map(file => path.join(moduleDir, file));

  for (const candidateFile of [...candidateFiles, ...fallbackFiles]) {
    if (!fs.existsSync(candidateFile)) {
      continue;
    }
    const setCode = extractSetCodeFromSource(fs.readFileSync(candidateFile, 'utf8'));
    if (setCode) {
      return setCode;
    }
  }

  return undefined;
}

function getSetCodeToModules(): Map<string, string[]> {
  if (setCodeToModules) {
    return setCodeToModules;
  }

  const map = new Map<string, string[]>();
  for (const moduleName of getExportedSetModulePaths()) {
    const setCode = inferSetCodeFromModule(moduleName);
    if (!setCode) {
      continue;
    }
    const modules = map.get(setCode) ?? [];
    modules.push(moduleName);
    map.set(setCode, modules);
  }

  setCodeToModules = map;
  return map;
}

function extractSetCodeFromFullName(fullName: string): string {
  const tokens = fullName.trim().split(/\s+/);
  const lastToken = tokens[tokens.length - 1]?.toUpperCase();
  if (!lastToken || !SET_CODE_REGEX.test(lastToken)) {
    throw new Error(`[headless] Could not infer set code from card fullName "${fullName}"`);
  }
  return lastToken;
}

function loadSetModule(moduleName: string): void {
  if (loadedSetModules.has(moduleName)) {
    return;
  }

  const mod = require(path.join(setsDir, moduleName));
  for (const key of Object.keys(mod)) {
    const value = mod[key];
    if (Array.isArray(value) && value.length > 0 && value[0] instanceof Card) {
      defineSet(value);
    }
  }
  loadedSetModules.add(moduleName);
}

function ensureSetCodeLoaded(setCode: string): void {
  const modulePaths = getSetCodeToModules().get(setCode);
  if (!modulePaths || modulePaths.length === 0) {
    throw new Error(`[headless] No set module found for set code "${setCode}"`);
  }

  modulePaths.forEach(loadSetModule);
}

export function registerCardsForNames(cardNames: string[]): void {
  const cardManager = CardManager.getInstance();
  const namesToRegister = Array.from(new Set(cardNames.map(name => name.trim()).filter(Boolean)));

  for (const fullName of namesToRegister) {
    if (!cardManager.isCardDefined(fullName)) {
      ensureSetCodeLoaded(extractSetCodeFromFullName(fullName));
    }
  }

  updateKnownCards();
}

export function registerAllCards(): void {
  if (allCardsRegistered) {
    updateKnownCards();
    return;
  }

  const sets = require(path.join(setsDir, 'index'));
  const entries = Object.keys(sets)
    .filter(key => key.startsWith('set') && Array.isArray(sets[key]))
    .map(key => ({ key: `sets.${key}`, cards: sets[key] as Card[] }));
  const validationErrors = CardManager.validateAllSets(entries);
  if (validationErrors.length > 0) {
    throw new Error(`Card manager validation failed:\n${validationErrors.join('\n')}`);
  }

  entries.forEach(entry => defineSet(entry.cards));
  allCardsRegistered = true;
  updateKnownCards();
}
