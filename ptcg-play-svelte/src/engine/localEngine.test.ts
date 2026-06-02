import { describe, expect, it } from 'vitest';
import { LocalEngineController } from './localEngine';
import { SlotType, targetFor } from '../lib/game/types';
import { parseDeckList, SAMPLE_DECK } from '../lib/game/deckImport';

const setupDeck = parseDeckList(SAMPLE_DECK).cards;

describe('LocalEngineController', () => {
  it('starts a manual game from two decklists and exposes setup prompts', async () => {
    const engine = new LocalEngineController();
    try {
      const res = await engine.handle({
        type: 'startGame',
        payload: {
          player1: { name: 'A', deck: setupDeck },
          player2: { name: 'B', deck: setupDeck },
        },
      });

      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.view.players).toHaveLength(2);
        expect(res.view.phaseLabel).toBe('Setup');
        expect(res.view.prompts.length).toBeGreaterThan(0);
        expect(res.view.prompts.some((prompt) => prompt.playerIndex === 0 || prompt.playerIndex === 1)).toBe(true);
      }
    } finally {
      engine.close();
    }
  });

  it('can manually resolve setup prompts into a player turn', async () => {
    const engine = new LocalEngineController();
    try {
      const res = await startAndResolveSetup(engine);

      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.view.phaseLabel).toBe('Player turn');
        expect(res.view.prompts).toHaveLength(0);
        expect(res.view.players[0]?.active.empty).toBe(false);
        expect(res.view.players[1]?.active.empty).toBe(false);
      }
    } finally {
      engine.close();
    }
  });

  it('plays a local self-play turn flow after manual setup', async () => {
    const engine = new LocalEngineController();
    try {
      let res = await engine.handle({
        type: 'setupScenario',
        payload: {
          promptMode: 'manual',
          player1: {
            name: 'A',
            active: { card: 'Ralts SIT' },
            hand: ['Psychic Energy SVE'],
            deck: ['Water Energy SVE'],
          },
          player2: {
            name: 'B',
            active: { card: 'Ralts SIT' },
            hand: ['Psychic Energy SVE'],
            deck: ['Water Energy SVE'],
          },
          turn: 2,
          activePlayer: 0,
        },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;

      let handIndex = res.view.players[0]?.hand.findIndex((card) => card.fullName === 'Psychic Energy SVE') ?? -1;
      expect(handIndex).toBeGreaterThanOrEqual(0);
      res = await engine.handle({
        type: 'playCard',
        payload: { playerIndex: 0, handIndex, target: targetFor(0, 0, SlotType.ACTIVE) },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      expect(res.view.players[0]?.active.energy).toHaveLength(1);

      res = await engine.handle({ type: 'passTurn', payload: { playerIndex: 0 } });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      expect(res.view.activePlayerIndex).toBe(1);

      handIndex = res.view.players[1]?.hand.findIndex((card) => card.fullName === 'Psychic Energy SVE') ?? -1;
      expect(handIndex).toBeGreaterThanOrEqual(0);
      res = await engine.handle({
        type: 'playCard',
        payload: { playerIndex: 1, handIndex, target: targetFor(1, 1, SlotType.ACTIVE) },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;

      res = await engine.handle({ type: 'attack', payload: { playerIndex: 1, attack: 'Memory Skip' } });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      expect(res.view.prompts[0]?.className).toBe('ChooseAttackPrompt');

      res = await engine.handle({
        type: 'resolvePrompt',
        payload: { id: res.view.prompts[0].id, result: { index: 0, attack: 'Memory Skip' } },
      });
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.view.players[0]?.active.damage).toBe(10);
        expect(res.view.activePlayerIndex).toBe(0);
      }
    } finally {
      engine.close();
    }
  });

  it('keeps KO prize and replacement-active prompts manual', async () => {
    const engine = new LocalEngineController();
    try {
      let res = await engine.handle({
        type: 'setupScenario',
        payload: {
          promptMode: 'manual',
          player1: {
            name: 'A',
            active: { card: 'Raichu SIT', energy: ['Lightning Energy SVE'] },
            deck: ['Water Energy SVE'],
          },
          player2: {
            name: 'B',
            active: { card: 'Ralts SIT', damage: 50 },
            bench: [{ card: 'Ralts SIT' }],
            deck: ['Water Energy SVE'],
          },
          turn: 2,
          activePlayer: 0,
        },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;

      res = await engine.handle({ type: 'attack', payload: { playerIndex: 0, attack: 'Ambushing Spark' } });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      expect(res.view.phaseLabel).toBe('Attack');
      expect(res.view.prompts[0]?.className).toBe('ChoosePrizePrompt');
      expect((res.view.prompts[0]?.fields.prizes as any[])?.map((prize) => prize.index)).toEqual([0, 1, 2, 3, 4, 5]);

      res = await engine.handle({
        type: 'resolvePrompt',
        payload: { id: res.view.prompts[0].id, result: [0] },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      expect(res.view.players[0]?.prizesLeft).toBe(5);
      expect(res.view.players[1]?.discard.map((card) => card.fullName)).toContain('Ralts SIT');
      expect(res.view.prompts[0]?.className).toBe('ChoosePokemonPrompt');

      res = await engine.handle({
        type: 'resolvePrompt',
        payload: { id: res.view.prompts[0].id, result: [targetFor(1, 1, SlotType.BENCH, 0)] },
      });
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.view.phaseLabel).toBe('Player turn');
        expect(res.view.activePlayerIndex).toBe(1);
        expect(res.view.players[1]?.active.pokemon?.fullName).toBe('Ralts SIT');
        expect(res.view.prompts).toHaveLength(0);
      }
    } finally {
      engine.close();
    }
  });

  it('uses Pokemon abilities through the local command boundary', async () => {
    const engine = new LocalEngineController();
    try {
      let res = await engine.handle({
        type: 'setupScenario',
        payload: {
          promptMode: 'manual',
          player1: {
            name: 'A',
            active: { card: 'Regidrago ASR' },
            deck: ['Water Energy SVE', 'Water Energy SVE', 'Water Energy SVE', 'Water Energy SVE'],
          },
          player2: {
            name: 'B',
            active: { card: 'Ralts SIT' },
            deck: ['Water Energy SVE'],
          },
          turn: 2,
          activePlayer: 0,
        },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      expect(res.view.players[0]?.active.pokemon?.powers?.[0]?.name).toBe("Dragon's Hoard");
      expect(res.view.players[0]?.hand).toHaveLength(0);

      res = await engine.handle({
        type: 'useAbility',
        payload: {
          playerIndex: 0,
          ability: "Dragon's Hoard",
          target: targetFor(0, 0, SlotType.ACTIVE),
        },
      });

      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.view.players[0]?.hand).toHaveLength(4);
        expect(res.view.players[0]?.deckCount).toBe(0);
        expect(res.view.logs.map((log) => log.message)).toContain('LOG_PLAYER_USES_ABILITY');
      }
    } finally {
      engine.close();
    }
  });

  it('exposes engine-owned ability used legality for repeated abilities', async () => {
    const engine = new LocalEngineController();
    try {
      let res = await engine.handle({
        type: 'setupScenario',
        payload: {
          promptMode: 'manual',
          player1: {
            name: 'A',
            active: { card: 'Drakloak TWM' },
            deck: ['Water Energy SVE', 'Psychic Energy SVE'],
          },
          player2: {
            name: 'B',
            active: { card: 'Ralts SIT' },
            deck: ['Water Energy SVE'],
          },
          turn: 2,
          activePlayer: 0,
        },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;

      expect(res.view.players[0]?.availableActions?.active?.abilities).toEqual([
        { name: 'Recon Directive', legal: true, used: false },
      ]);

      res = await engine.handle({
        type: 'useAbility',
        payload: {
          playerIndex: 0,
          ability: 'Recon Directive',
          target: targetFor(0, 0, SlotType.ACTIVE),
        },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      expect(res.view.prompts[0]?.className).toBe('ChooseCardsPrompt');

      res = await engine.handle({
        type: 'resolvePrompt',
        payload: { id: res.view.prompts[0].id, result: [0] },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;

      const ability = res.view.players[0]?.availableActions?.active?.abilities[0];
      expect(ability).toMatchObject({
        name: 'Recon Directive',
        legal: false,
        used: true,
        reason: 'POWER_ALREADY_USED',
      });
    } finally {
      engine.close();
    }
  });

  it('exposes engine-owned attack legality from dry-run attack actions', async () => {
    const engine = new LocalEngineController();
    try {
      const res = await engine.handle({
        type: 'setupScenario',
        payload: {
          promptMode: 'manual',
          player1: {
            name: 'A',
            active: { card: 'Raichu SIT', energy: ['Lightning Energy SVE'] },
            deck: ['Water Energy SVE'],
          },
          player2: {
            name: 'B',
            active: { card: 'Ralts SIT' },
            deck: ['Water Energy SVE'],
          },
          turn: 2,
          activePlayer: 0,
        },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;

      expect(res.view.players[0]?.availableActions?.active?.attacks).toEqual([
        { name: 'Ambushing Spark', legal: true },
        { name: 'Electric Ball', legal: false, reason: 'NOT_ENOUGH_ENERGY' },
      ]);
    } finally {
      engine.close();
    }
  });

  it('defaults headless available actions to active-player scope', async () => {
    const engine = new LocalEngineController();
    try {
      let res = await engine.handle({
        type: 'setupScenario',
        payload: {
          promptMode: 'manual',
          player1: {
            name: 'A',
            active: { card: 'Raichu SIT', energy: ['Lightning Energy SVE'] },
            deck: ['Water Energy SVE'],
          },
          player2: {
            name: 'B',
            active: { card: 'Ralts SIT' },
            deck: ['Water Energy SVE'],
          },
          turn: 2,
          activePlayer: 0,
        },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      expect(res.view.players[0]?.availableActions).toBeDefined();
      expect(res.view.players[1]?.availableActions).toBeUndefined();

      res = await engine.handle({
        type: 'state',
        availableActionsScope: 'full',
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      expect(res.view.players[0]?.availableActions).toBeDefined();
      expect(res.view.players[1]?.availableActions).toBeDefined();

      res = await engine.handle({
        type: 'state',
        availableActionsScope: 'none',
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      expect(res.view.players[0]?.availableActions).toBeUndefined();
      expect(res.view.players[1]?.availableActions).toBeUndefined();
    } finally {
      engine.close();
    }
  });

  it('plays trainer cards that open manual deck-search prompts', async () => {
    const engine = new LocalEngineController();
    try {
      let res = await engine.handle({
        type: 'setupScenario',
        payload: {
          promptMode: 'manual',
          player1: {
            name: 'A',
            active: { card: 'Ralts SIT' },
            hand: ['Nest Ball SVI'],
            deck: ['Ralts SIT', 'Psychic Energy SVE', 'Psychic Energy SVE'],
          },
          player2: {
            name: 'B',
            active: { card: 'Ralts SIT' },
            deck: ['Water Energy SVE'],
          },
          turn: 2,
          activePlayer: 0,
        },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;

      res = await engine.handle({
        type: 'playCard',
        payload: { playerIndex: 0, handIndex: 0, target: targetFor(0, 0, SlotType.ACTIVE) },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      expect(res.view.prompts[0]?.className).toBe('ChooseCardsPrompt');
      expect(res.view.prompts[0]?.message).toBe('CHOOSE_CARD_TO_PUT_ONTO_BENCH');
      expect((res.view.prompts[0]?.fields.cardList as any[])[0].fullName).toBe('Ralts SIT');

      res = await engine.handle({
        type: 'resolvePrompt',
        payload: { id: res.view.prompts[0].id, result: [0] },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      expect(res.view.players[0]?.bench[0]?.pokemon?.fullName).toBe('Ralts SIT');
      expect(res.view.prompts).toHaveLength(0);
      expect(res.view.players[0]?.discard.map((card) => card.fullName)).toContain('Nest Ball SVI');
      expect(res.view.players[0]?.deckCount).toBe(2);
    } finally {
      engine.close();
    }
  });

  it('drives chained trainer prompts for discard-then-search cards', async () => {
    const engine = new LocalEngineController();
    try {
      let res = await engine.handle({
        type: 'setupScenario',
        payload: {
          promptMode: 'manual',
          player1: {
            name: 'A',
            active: { card: 'Ralts SIT' },
            hand: ['Ultra Ball SVI', 'Psychic Energy SVE', 'Psychic Energy SVE'],
            deck: ['Charmander BS', 'Water Energy SVE'],
          },
          player2: {
            name: 'B',
            active: { card: 'Ralts SIT' },
            deck: ['Water Energy SVE'],
          },
          turn: 2,
          activePlayer: 0,
        },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;

      res = await engine.handle({
        type: 'playCard',
        payload: { playerIndex: 0, handIndex: 0, target: targetFor(0, 0, SlotType.ACTIVE) },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      expect(res.view.prompts[0]?.message).toBe('CHOOSE_CARD_TO_DISCARD');

      res = await engine.handle({
        type: 'resolvePrompt',
        payload: { id: res.view.prompts[0].id, result: [0, 1] },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      expect(res.view.prompts[0]?.message).toBe('CHOOSE_CARD_TO_HAND');
      expect(res.view.players[0]?.discard.map((card) => card.fullName)).toEqual([
        'Psychic Energy SVE',
        'Psychic Energy SVE',
      ]);

      res = await engine.handle({
        type: 'resolvePrompt',
        payload: { id: res.view.prompts[0].id, result: [0] },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      expect(res.view.prompts[0]?.className).toBe('ShowCardsPrompt');
      expect(res.view.players[0]?.hand.map((card) => card.fullName)).toEqual(['Charmander BS']);

      res = await engine.handle({
        type: 'resolvePrompt',
        payload: { id: res.view.prompts[0].id, result: true },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      expect(res.view.prompts).toHaveLength(0);
      expect(res.view.players[0]?.discard.map((card) => card.fullName)).toContain('Ultra Ball SVI');
      expect(res.view.players[0]?.deckCount).toBe(1);
    } finally {
      engine.close();
    }
  });

  it('plays and uses stadium cards through manual prompts', async () => {
    const engine = new LocalEngineController();
    try {
      let res = await engine.handle({
        type: 'setupScenario',
        payload: {
          promptMode: 'manual',
          player1: {
            name: 'A',
            active: { card: 'Ralts SIT' },
            hand: ['Artazon PAL'],
            deck: ['Charmander BS', 'Water Energy SVE'],
          },
          player2: {
            name: 'B',
            active: { card: 'Ralts SIT' },
            deck: ['Water Energy SVE'],
          },
          turn: 2,
          activePlayer: 0,
        },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;

      res = await engine.handle({
        type: 'playCard',
        payload: { playerIndex: 0, handIndex: 0, target: targetFor(0, 0, SlotType.ACTIVE) },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      expect(res.view.players[0]?.stadium.map((card) => card.fullName)).toEqual(['Artazon PAL']);

      res = await engine.handle({ type: 'useStadium', payload: { playerIndex: 0 } });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      expect(res.view.prompts[0]?.className).toBe('ChooseCardsPrompt');
      expect(res.view.prompts[0]?.message).toBe('CHOOSE_CARD_TO_PUT_ONTO_BENCH');

      res = await engine.handle({
        type: 'resolvePrompt',
        payload: { id: res.view.prompts[0].id, result: [0] },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      expect(res.view.players[0]?.bench[0]?.pokemon?.fullName).toBe('Charmander BS');
      expect(res.view.prompts).toHaveLength(0);
      expect(res.view.players[0]?.stadium.map((card) => card.fullName)).toEqual(['Artazon PAL']);
      expect(res.view.players[0]?.deckCount).toBe(1);
    } finally {
      engine.close();
    }
  });

  it('plays evolution Pokemon onto matching occupied slots', async () => {
    const engine = new LocalEngineController();
    try {
      let res = await engine.handle({
        type: 'setupScenario',
        payload: {
          promptMode: 'manual',
          player1: {
            name: 'A',
            active: { card: 'Charmander BS' },
            hand: ['Charmeleon BS'],
            deck: ['Water Energy SVE'],
          },
          player2: {
            name: 'B',
            active: { card: 'Ralts SIT' },
            deck: ['Water Energy SVE'],
          },
          turn: 3,
          activePlayer: 0,
        },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      expect(res.view.players[0]?.hand[0]?.evolvesFrom).toBe('Charmander');

      res = await engine.handle({
        type: 'playCard',
        payload: { playerIndex: 0, handIndex: 0, target: targetFor(0, 0, SlotType.ACTIVE) },
      });
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.view.players[0]?.active.pokemon?.fullName).toBe('Charmeleon BS');
        expect(res.view.players[0]?.active.cards.map((card) => card.fullName)).toEqual([
          'Charmander BS',
          'Charmeleon BS',
        ]);
      }
    } finally {
      engine.close();
    }
  });

  it('retreats to an occupied bench slot and discards the retreat cost', async () => {
    const engine = new LocalEngineController();
    try {
      let res = await engine.handle({
        type: 'setupScenario',
        payload: {
          promptMode: 'manual',
          player1: {
            name: 'A',
            active: { card: 'Ralts SIT', energy: ['Psychic Energy SVE'] },
            bench: [{ card: 'Ralts SIT' }],
            deck: ['Water Energy SVE'],
          },
          player2: {
            name: 'B',
            active: { card: 'Ralts SIT' },
            deck: ['Water Energy SVE'],
          },
          turn: 2,
          activePlayer: 0,
        },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;
      expect(res.view.players[0]?.active.retreat).toHaveLength(1);
      expect(res.view.players[0]?.active.energy).toHaveLength(1);
      expect(res.view.players[0]?.availableActions?.active?.retreat).toEqual({ legal: true, targets: [0] });

      res = await engine.handle({ type: 'retreat', payload: { playerIndex: 0, to: 0 } });
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.view.players[0]?.discard.map((card) => card.fullName)).toContain('Psychic Energy SVE');
        expect(res.view.players[0]?.active.pokemon?.fullName).toBe('Ralts SIT');
        expect(res.view.players[0]?.active.energy).toHaveLength(0);
        expect(res.view.logs.map((log) => log.message)).toContain('LOG_PLAYER_RETREATS');
      }
    } finally {
      engine.close();
    }
  });

  it('exposes engine-owned retreat illegality when retreat cost cannot be paid', async () => {
    const engine = new LocalEngineController();
    try {
      const res = await engine.handle({
        type: 'setupScenario',
        payload: {
          promptMode: 'manual',
          player1: {
            name: 'A',
            active: { card: 'Ralts SIT' },
            bench: [{ card: 'Ralts SIT' }],
            deck: ['Water Energy SVE'],
          },
          player2: {
            name: 'B',
            active: { card: 'Ralts SIT' },
            deck: ['Water Energy SVE'],
          },
          turn: 2,
          activePlayer: 0,
        },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;

      expect(res.view.players[0]?.availableActions?.active?.retreat).toEqual({
        legal: false,
        targets: [],
        reason: 'NOT_ENOUGH_ENERGY',
      });
    } finally {
      engine.close();
    }
  });

  it('ends a local self-play game when a player concedes', async () => {
    const engine = new LocalEngineController();
    try {
      let res = await engine.handle({
        type: 'setupScenario',
        payload: {
          promptMode: 'manual',
          player1: {
            name: 'A',
            active: { card: 'Ralts SIT' },
            deck: ['Water Energy SVE'],
          },
          player2: {
            name: 'B',
            active: { card: 'Ralts SIT' },
            deck: ['Water Energy SVE'],
          },
          turn: 2,
          activePlayer: 0,
        },
      });
      expect(res.ok).toBe(true);
      if (!res.ok) return;

      res = await engine.handle({ type: 'concede', payload: { playerIndex: 0 } });
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.view.phaseLabel).toBe('Finished');
        expect(res.view.winner).toBe(1);
        expect(res.view.logs.map((log) => log.message)).toContain('LOG_PLAYER_CONCEDED');
        expect(res.view.logs.map((log) => log.message)).toContain('LOG_GAME_FINISHED_WINNER');
      }
    } finally {
      engine.close();
    }
  });

  it('drives simple manual actions through the same JSON command boundary', async () => {
    const engine = new LocalEngineController();
    try {
      const setup = await engine.handle({
        type: 'setupScenario',
        payload: {
          player1: {
            name: 'A',
            active: { card: 'Raichu SIT', energy: ['Lightning Energy SVE'] },
            deck: ['Water Energy SVE'],
          },
          player2: {
            name: 'B',
            active: { card: 'Ralts SIT' },
            deck: ['Water Energy SVE'],
          },
          turn: 2,
          activePlayer: 0,
        },
      });
      expect(setup.ok).toBe(true);

      const attack = await engine.handle({ type: 'attack', payload: { playerIndex: 0, attack: 'Ambushing Spark' } });
      expect(attack.ok).toBe(true);
      if (attack.ok) {
        expect(attack.view.players[1]?.active.damage).toBe(40);
        expect(attack.view.activePlayerIndex).toBe(1);
      }

      const pass = await engine.handle({ type: 'passTurn', payload: { playerIndex: 1 } });
      expect(pass.ok).toBe(true);
    } finally {
      engine.close();
    }
  });

  it('keeps targets relative to the acting player', () => {
    expect(targetFor(0, 0, SlotType.ACTIVE)).toEqual({ player: 2, slot: 1, index: 0 });
    expect(targetFor(0, 1, SlotType.ACTIVE)).toEqual({ player: 1, slot: 1, index: 0 });
  });
});

async function startAndResolveSetup(engine: LocalEngineController) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    let res = await engine.handle({
        type: 'startGame',
        payload: {
          player1: { name: 'A', deck: setupDeck },
          player2: { name: 'B', deck: setupDeck },
        },
      });

    for (let guard = 0; guard < 16 && res.ok && res.view.prompts.length > 0; guard += 1) {
      const prompt = res.view.prompts[0];
      const cards = ((prompt.fields.cards as any[]) ?? (prompt.fields.cardList as any[]) ?? []) as Array<{ index?: number }>;
      const blocked = new Set<number>(Array.isArray((prompt.fields.options as any)?.blocked) ? (prompt.fields.options as any).blocked : []);
      const firstAllowedIndex = cards
        .map((card, index) => card.index ?? index)
        .find((index) => !blocked.has(index)) ?? 0;
      const result =
        prompt.className === 'ConfirmPrompt'
          ? true
          : prompt.className === 'ChooseCardsPrompt'
            ? [firstAllowedIndex]
            : ['AlertPrompt', 'ShowCardsPrompt', 'ConfirmCardsPrompt', 'ShowMulliganPrompt'].includes(prompt.className)
              ? true
              : null;

      res = await engine.handle({ type: 'resolvePrompt', payload: { id: prompt.id, result } });
    }

    if (res.ok && res.view.phaseLabel === 'Player turn') {
      return res;
    }
  }

  return engine.handle({ type: 'state' });
}
