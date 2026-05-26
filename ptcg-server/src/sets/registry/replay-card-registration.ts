import { ungzip } from '@progress/pako-esm';

import { Replay } from '../../game/core/replay';
import { ReplayOptions } from '../../game/core/replay.interface';
import { SerializedState } from '../../game/serializer/serializer.interface';
import { registerCardsForNames } from './card-registration';

const SET_CODE_REGEX = /^[A-Z0-9-]{2,8}$/;

interface ReplayPayload {
  states?: SerializedState[];
  actions?: any[];
}

export function deserializeReplayWithRegisteredCards(
  replayData: string,
  options: Partial<ReplayOptions> = {}
): Replay {
  registerReplayCards(replayData);
  const replay = new Replay(options);
  replay.deserialize(replayData);
  return replay;
}

export function registerReplayCards(replayData: string): string[] {
  const cardNames = extractReplayCardNames(replayData);
  registerCardsForNames(cardNames);
  return cardNames;
}

export function extractReplayCardNames(replayData: string): string[] {
  const payload = parseReplayPayload(replayData);
  const cardNames = new Set<string>();
  const states = Array.isArray(payload.states) ? payload.states : [];

  states.forEach(stateData => collectSerializedStateCardNames(stateData, cardNames));
  collectCardFullNames(payload.actions, cardNames);

  return Array.from(cardNames);
}

function parseReplayPayload(replayData: string): ReplayPayload {
  return JSON.parse(ungzip(replayData, { to: 'string' }));
}

function collectSerializedStateCardNames(stateData: SerializedState, cardNames: Set<string>): void {
  const parsed = JSON.parse(swapReplayQuotes(stateData));

  if (parsed.length > 1) {
    collectCardNameArray(parsed[1]?.cardNames, cardNames);
    return;
  }

  const diff = parsed[0];
  if (!Array.isArray(diff)) {
    return;
  }

  diff.forEach(operation => {
    if (typeof operation?.path === 'string' && operation.path.split('.').pop() === 'cardNames') {
      collectCardNameArray(operation.val, cardNames);
    }
  });
}

function collectCardNameArray(value: any, cardNames: Set<string>): void {
  if (!Array.isArray(value)) {
    return;
  }

  value.forEach(name => {
    if (typeof name === 'string') {
      addCardName(name, cardNames);
    }
  });
}

function collectCardFullNames(value: any, cardNames: Set<string>, seen = new WeakSet<object>()): void {
  if (value === null || value === undefined || typeof value !== 'object') {
    return;
  }

  if (seen.has(value)) {
    return;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    value.forEach(item => collectCardFullNames(item, cardNames, seen));
    return;
  }

  if (typeof value.fullName === 'string') {
    addCardName(value.fullName, cardNames);
  }

  Object.keys(value).forEach(key => collectCardFullNames(value[key], cardNames, seen));
}

function addCardName(name: string, cardNames: Set<string>): void {
  const normalized = name.trim();
  const tokens = normalized.split(/\s+/);
  const setCode = tokens[tokens.length - 1]?.toUpperCase();
  if (normalized !== '' && setCode && SET_CODE_REGEX.test(setCode)) {
    cardNames.add(normalized);
  }
}

function swapReplayQuotes(data: string): string {
  return data.replace(/["']/g, c => c === '"' ? '\'' : '"');
}
