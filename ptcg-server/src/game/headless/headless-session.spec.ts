import { spawn } from 'child_process';
import * as path from 'path';

import { GamePhase } from '../store/state/state';
import { createHeadlessGame } from './headless-session';

describe('HeadlessGameSession', () => {
  const simpleScenario = {
    player1: {
      name: 'Agent A',
      active: { card: 'Raichu SIT', energy: ['Lightning Energy SVE'] },
      deck: ['Water Energy SVE']
    },
    player2: {
      name: 'Agent B',
      active: { card: 'Ralts SIT' },
      deck: ['Water Energy SVE']
    },
    turn: 2,
    activePlayer: 0
  };

  it('dispatches a simple attack headlessly and resolves wait prompts', () => {
    const game = createHeadlessGame(simpleScenario);

    game.attack(0, 'Ambushing Spark');
    const snapshot = game.snapshot();

    expect(snapshot.summary.players[1].active.damage).toBe(40);
    expect(snapshot.summary.activePlayer).toBe(1);
    expect(snapshot.prompts.length).toBe(0);
  });

  it('can create a normal deck game through setup prompts', () => {
    const deck = ['Ralts SIT', 'Ralts SIT', 'Ralts SIT', 'Ralts SIT', ...Array(56).fill('Water Energy SVE')];
    const game = createHeadlessGame({
      player1: { name: 'Agent A', deck },
      player2: { name: 'Agent B', deck }
    });
    const snapshot = game.snapshot();

    expect(snapshot.summary.phase).toBe(GamePhase.PLAYER_TURN);
    expect(snapshot.summary.players[0].active.pokemon).toBe('Ralts SIT');
    expect(snapshot.summary.players[1].active.pokemon).toBe('Ralts SIT');
    expect(snapshot.prompts.length).toBe(0);
  });

  it('reports live total HP from CheckHpEffect modifiers', () => {
    const game = createHeadlessGame({
      player1: {
        name: 'Agent A',
        active: { card: 'Ralts SIT', tools: ['Hero\'s Cape TEF'] },
        deck: ['Water Energy SVE']
      },
      player2: {
        name: 'Agent B',
        active: { card: 'Ralts SIT' },
        deck: ['Water Energy SVE']
      },
      turn: 2,
      activePlayer: 0
    });
    const snapshot = game.snapshot();

    expect(snapshot.summary.players[0].active.pokemonCard.hp).toBe(60);
    expect(snapshot.summary.players[0].active.hp).toBe(160);
  });

  it('scopes available actions to the active player by default', () => {
    const game = createHeadlessGame(simpleScenario);
    const snapshot = game.snapshot();

    expect(snapshot.summary.players[0].availableActions).toBeDefined();
    expect(snapshot.summary.players[1].availableActions).toBeUndefined();
  });

  it('can include full or no available actions on request', () => {
    const game = createHeadlessGame(simpleScenario);
    const full = game.snapshot({ availableActionsScope: 'full' });
    const none = game.snapshot({ availableActionsScope: 'none' });

    expect(full.summary.players[0].availableActions).toBeDefined();
    expect(full.summary.players[1].availableActions).toBeDefined();
    expect(none.summary.players[0].availableActions).toBeUndefined();
    expect(none.summary.players[1].availableActions).toBeUndefined();
  });

  it('supports alternating players and prompted attack choices', () => {
    const game = createHeadlessGame({
      player1: {
        name: 'Agent A',
        active: { card: 'Raichu SIT', energy: ['Lightning Energy SVE'] },
        deck: ['Water Energy SVE', 'Water Energy SVE', 'Water Energy SVE']
      },
      player2: {
        name: 'Agent B',
        active: { card: 'Ralts SIT', energy: ['Psychic Energy SVE'] },
        deck: ['Water Energy SVE', 'Water Energy SVE', 'Water Energy SVE']
      },
      turn: 2,
      activePlayer: 0
    });

    game.attack(0, 'Ambushing Spark');
    expect(game.snapshot().summary.players[1].active.damage).toBe(40);
    expect(game.snapshot().summary.activePlayer).toBe(1);

    game.attack(1, 'Memory Skip');
    expect(game.snapshot().summary.players[0].active.damage).toBe(10);
    expect(game.snapshot().summary.activePlayer).toBe(0);
    let blockedError = '';
    try {
      game.attack(0, 'Ambushing Spark');
    } catch (error: any) {
      blockedError = error.message;
    }
    expect(blockedError).toBe('BLOCKED_BY_EFFECT');

    game.passTurn(0);
    game.passTurn(1);
    game.attack(0, 'Ambushing Spark');
    expect(game.snapshot().summary.players[1].active.pokemon).toBeUndefined();
  });

  it('drives a simple game through the JSON stdio CLI', done => {
    const cwd = path.resolve(__dirname, '../../..');
    const tsNodeBin = require.resolve('ts-node/dist/bin.js');
    const child = spawn(process.execPath, [
      tsNodeBin,
      'src/headless-cli.ts',
      '--stdio'
    ], { cwd });

    const lines: string[] = [];
    let stderr = '';

    child.stdout.on('data', chunk => {
      chunk.toString().split('\n').filter(Boolean).forEach((line: string) => lines.push(line));
    });
    child.stderr.on('data', chunk => {
      stderr += chunk.toString();
    });
    child.on('close', code => {
      expect(code).toBe(0);
      expect(stderr.replace(/Browserslist:[\s\S]*?regularly: https:\/\/github\.com\/browserslist\/browserslist#browsers-data-updating\s*/g, '')).toBe('');
      expect(lines.length).toBe(2);
      const attackResponse = JSON.parse(lines[1]);
      expect(attackResponse.ok).toBe(true);
      expect(attackResponse.summary.players[1].active.damage).toBe(40);
      expect(attackResponse.prompts.length).toBe(0);
      done();
    });

    child.stdin.write(JSON.stringify({
      id: 'setup',
      type: 'setupScenario',
      payload: simpleScenario
    }) + '\n');
    child.stdin.write(JSON.stringify({
      id: 'attack',
      type: 'attack',
      payload: { player: 0, attack: 'Ambushing Spark' }
    }) + '\n');
    child.stdin.end();
  });
});
