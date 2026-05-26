import * as fs from 'fs';
import * as path from 'path';

import { Replay } from '../../game/core/replay';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Base64 } from '../../utils/base64';
import {
  deserializeReplayWithRegisteredCards,
  extractReplayCardNames
} from './replay-card-registration';

describe('replay card registration', () => {
  beforeEach(() => {
    (CardManager as any).instance = undefined;
    StateSerializer.setKnownCards([]);
  });

  it('extracts card names from a modern replay fixture', () => {
    const names = extractReplayCardNames(loadRailwayReplayData());

    expect(names).toContain('Dreepy TWM');
    expect(names).toContain('Dragapult ex TWM');
    expect(names).toContain('Meowth ex POR');
    expect(names).toContain('Budew PRE');
  });

  it('registers replay cards before deserializing from a cold card registry', () => {
    const replayData = loadRailwayReplayData();
    const unregisteredReplay = new Replay({ indexEnabled: true });

    expect(() => unregisteredReplay.deserialize(replayData)).toThrow();

    const replay = deserializeReplayWithRegisteredCards(replayData, { indexEnabled: true });

    expect(replay.getStateCount()).toBe(158);
    expect(replay.getActions().length).toBe(184);
    expect(replay.player1.name).toBe('Player2');
    expect(replay.player2.name).toBe('Player1');
    expect(replay.winner).toBe(1);
    expect(replay.getState(0).players[0].deck.cards[0].fullName).toBe('Dreepy TWM');
  });
});

function loadRailwayReplayData(): string {
  const fixturePath = path.join(__dirname, 'fixtures', 'railway-match-1.replay-response.json');
  const response = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  return new Base64().decode(response.replayData);
}
