import * as fs from 'fs';
import * as path from 'path';

import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Card } from '../../game/store/card/card';

const Module = require('module');

const setsDir = path.resolve(__dirname, '..');
const EXPORT_PATH_REGEX = /export \* from '\.\/([^']+)'/g;
const COMMONJS_EXPORT_PATH_REGEX = /__exportStar\(require\(["']\.\/([^"']+)["']\), exports\)/g;
const IMPORT_PATH_REGEX = /from '\.\/([^']+)'/g;
const COMMONJS_IMPORT_PATH_REGEX = /require\(["']\.\/([^"']+)["']\)/g;
const SET_DECLARATION_REGEX = /public set(?:\s*:\s*string)?\s*=\s*['"]([^'"]+)['"]/g;
const COMPILED_SET_DECLARATION_REGEX = /this\.set\s*=\s*['"]([^'"]+)['"]/g;
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
  const indexContent = fs.readFileSync(resolveModuleFile(path.join(setsDir, 'index')), 'utf8');
  const modulePaths: string[] = [];
  EXPORT_PATH_REGEX.lastIndex = 0;
  COMMONJS_EXPORT_PATH_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = EXPORT_PATH_REGEX.exec(indexContent)) !== null) {
    modulePaths.push(match[1]);
  }
  while ((match = COMMONJS_EXPORT_PATH_REGEX.exec(indexContent)) !== null) {
    modulePaths.push(match[1]);
  }
  return modulePaths;
}

function extractSetCodesFromSource(source: string): string[] {
  const setCodes = new Set<string>();
  for (const regex of [SET_DECLARATION_REGEX, COMPILED_SET_DECLARATION_REGEX]) {
    regex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(source)) !== null) {
      const setCode = match[1].toUpperCase();
      if (SET_CODE_REGEX.test(setCode)) {
        setCodes.add(setCode);
      }
    }
  }
  return Array.from(setCodes);
}

function inferSetCodesFromModule(moduleName: string): string[] {
  const moduleDir = path.join(setsDir, moduleName);
  const indexPath = findModuleFile(path.join(moduleDir, 'index'));
  if (!fs.existsSync(indexPath)) {
    return [];
  }

  const indexContent = fs.readFileSync(indexPath, 'utf8');
  const candidateFiles: string[] = [];
  IMPORT_PATH_REGEX.lastIndex = 0;
  COMMONJS_IMPORT_PATH_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = IMPORT_PATH_REGEX.exec(indexContent)) !== null) {
    candidateFiles.push(resolveModuleFile(path.join(moduleDir, match[1])));
  }
  while ((match = COMMONJS_IMPORT_PATH_REGEX.exec(indexContent)) !== null) {
    candidateFiles.push(resolveModuleFile(path.join(moduleDir, match[1])));
  }

  const fallbackFiles = fs.readdirSync(moduleDir)
    .filter(file => (file.endsWith('.ts') || file.endsWith('.js')) && file !== 'index.ts' && file !== 'index.js')
    .map(file => path.join(moduleDir, file));

  const setCodes = new Set<string>();
  for (const candidateFile of [...candidateFiles, ...fallbackFiles]) {
    if (!fs.existsSync(candidateFile)) {
      continue;
    }
    for (const setCode of extractSetCodesFromSource(fs.readFileSync(candidateFile, 'utf8'))) {
      setCodes.add(setCode);
    }
  }

  return Array.from(setCodes);
}

function getSetCodeToModules(): Map<string, string[]> {
  if (setCodeToModules) {
    return setCodeToModules;
  }

  const map = new Map<string, string[]>();
  for (const moduleName of getExportedSetModulePaths()) {
    for (const setCode of inferSetCodesFromModule(moduleName)) {
      const modules = map.get(setCode) ?? [];
      modules.push(moduleName);
      map.set(setCode, modules);
    }
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
  const mod = requirePreferLocal(path.join(setsDir, moduleName, 'index'));
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

  const sets = requirePreferLocal(path.join(setsDir, 'index'));
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

function findModuleFile(filePath: string): string {
  if (path.extname(filePath) && fs.existsSync(filePath)) {
    return filePath;
  }

  const tsFile = `${filePath}.ts`;
  if (fs.existsSync(tsFile)) {
    return tsFile;
  }

  const jsFile = `${filePath}.js`;
  if (fs.existsSync(jsFile)) {
    return jsFile;
  }

  const tsIndex = path.join(filePath, 'index.ts');
  if (fs.existsSync(tsIndex)) {
    return tsIndex;
  }

  const jsIndex = path.join(filePath, 'index.js');
  if (fs.existsSync(jsIndex)) {
    return jsIndex;
  }

  return filePath;
}

function resolveModuleFile(filePath: string): string {
  const resolved = findModuleFile(filePath);
  if (fs.existsSync(resolved)) {
    return resolved;
  }
  throw new Error(`[cards] Module file not found for "${filePath}"`);
}

function requirePreferLocal(filePath: string): any {
  const originalResolve = (Module as any)._resolveFilename;
  (Module as any)._resolveFilename = function (request: string, parent: any, isMain: boolean, options: any) {
    if (parent?.filename?.startsWith(setsDir) && request.startsWith('.') && !path.extname(request)) {
      const absolute = path.resolve(path.dirname(parent.filename), request);
      return resolveModuleFile(absolute);
    }
    return originalResolve.call(this, request, parent, isMain, options);
  };

  try {
    return require(resolveModuleFile(filePath));
  } finally {
    (Module as any)._resolveFilename = originalResolve;
  }
}
