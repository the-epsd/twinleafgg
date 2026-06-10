import * as fs from 'fs';
import * as path from 'path';

import { HEADLESS_PROMPT_ADAPTERS, serializeHeadlessPrompt } from './prompt-adapters';
import { createHeadlessGame } from './headless-session';
import { HeadlessPromptResolver } from './prompt-resolution';
import { GameMessage } from '../game-message';
import { PlayerType, SlotType } from '../store/actions/play-card-action';
import { CardType, SuperType } from '../store/card/card-types';
import { AlertPrompt } from '../store/prompts/alert-prompt';
import { AttachEnergyPrompt } from '../store/prompts/attach-energy-prompt';
import { ChooseAttackPrompt } from '../store/prompts/choose-attack-prompt';
import { ChooseCardsPrompt } from '../store/prompts/choose-cards-prompt';
import { ChooseEnergyPrompt } from '../store/prompts/choose-energy-prompt';
import { ChoosePokemonPrompt } from '../store/prompts/choose-pokemon-prompt';
import { ChoosePrizePrompt } from '../store/prompts/choose-prize-prompt';
import { CoinFlipPrompt } from '../store/prompts/coin-flip-prompt';
import { ConfirmCardsPrompt } from '../store/prompts/confirm-cards-prompt';
import { ConfirmPrompt } from '../store/prompts/confirm-prompt';
import { DiscardEnergyPrompt } from '../store/prompts/discard-energy-prompt';
import { MoveDamagePrompt } from '../store/prompts/move-damage-prompt';
import { MoveEnergyPrompt } from '../store/prompts/move-energy-prompt';
import { OrderCardsPrompt } from '../store/prompts/order-cards-prompt';
import { PutDamagePrompt } from '../store/prompts/put-damage-prompt';
import { RemoveDamagePrompt } from '../store/prompts/remove-damage-prompt';
import { SelectOptionPrompt } from '../store/prompts/select-option-prompt';
import { SelectPrompt } from '../store/prompts/select-prompt';
import { ShowCardsPrompt } from '../store/prompts/show-cards-prompt';
import { ShowMulliganPrompt } from '../store/prompts/show-mulligan-prompt';
import { ShufflePrizesPrompt } from '../store/prompts/shuffle-prizes-prompt';
import { ShuffleDeckPrompt } from '../store/prompts/shuffle-prompt';
import { WaitPrompt } from '../store/prompts/wait-prompt';

describe('Headless prompt adapters', () => {
  it('accounts for every prompt class in the engine prompt directory', () => {
    const promptDir = path.resolve(__dirname, '../store/prompts');
    const promptClasses = fs.readdirSync(promptDir)
      .filter(file => file.endsWith('.ts') && !file.endsWith('.spec.ts'))
      .flatMap(file => {
        const source = fs.readFileSync(path.join(promptDir, file), 'utf8');
        const matches: string[] = [];
        const regex = /export\s+(?:abstract\s+)?class\s+(\w*Prompt)\b/g;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(source)) !== null) {
          if (match[1] !== 'Prompt') {
            matches.push(match[1]);
          }
        }
        return matches;
      })
      .sort();

    const adapterClasses = HEADLESS_PROMPT_ADAPTERS.map(adapter => adapter.className).sort();
    expect(adapterClasses).toEqual(promptClasses);
  });

  it('keeps unsupported prompt classes explicit', () => {
    const unsupported = HEADLESS_PROMPT_ADAPTERS
      .filter(adapter => !adapter.supported)
      .map(adapter => adapter.className)
      .sort();

    expect(unsupported).toEqual(['InvitePlayerPrompt', 'ShuffleHandPrompt']);
  });

  it('serializes manual prompts with agent-readable fields', () => {
    const game = createHeadlessGame({
      promptMode: 'manual',
      player1: {
        name: 'Agent A',
        active: { card: 'Raichu SIT', energy: ['Lightning Energy SVE'] },
        deck: ['Water Energy SVE', 'Water Energy SVE']
      },
      player2: {
        name: 'Agent B',
        active: { card: 'Ralts SIT', energy: ['Psychic Energy SVE'] },
        deck: ['Water Energy SVE', 'Water Energy SVE']
      },
      turn: 3,
      activePlayer: 1
    });

    game.attack(1, 'Memory Skip');
    const prompt = game.snapshot().prompts[0];

    expect(prompt.className).toBe('ChooseAttackPrompt');
    expect(prompt.supported).toBe(true);
    expect(prompt.resultSchema).toBe('{ index: number, attack: string } | null');
    expect(prompt.fields.cards[0].fullName).toBe('Raichu SIT');
    expect(prompt.fields.cards[0].imageUrl).toBe('https://images.pokemontcg.io/swsh12/50.png');
    expect(prompt.fields.cards[0].attacks[0].name).toBe('Ambushing Spark');
  });

  it('serializes prize prompts with selectable prize indexes', () => {
    const game = createHeadlessGame({
      player1: {
        name: 'Agent A',
        active: { card: 'Ralts SIT' },
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
    const player = game.state.players[0];
    const prompt = new ChoosePrizePrompt(player.id, GameMessage.CHOOSE_PRIZE_CARD, {
      count: 2,
      isSecret: false
    });
    const serialized = serializeHeadlessPrompt(game.state, prompt);

    expect(serialized.fields.options.count).toBe(2);
    expect(serialized.fields.prizes.length).toBe(6);
    expect(serialized.fields.prizes[0].index).toBe(0);
    expect(serialized.fields.prizes[0].cards[0].fullName).toBe('Water Energy SVE');
  });

  it('provides valid deterministic defaults for every supported prompt fixture', () => {
    const resolver = new HeadlessPromptResolver();
    const game = createHeadlessGame({
      player1: {
        name: 'Agent A',
        active: { card: 'Ralts SIT', energy: ['Psychic Energy SVE'], damage: 20 },
        bench: [{ card: 'Pikachu SIT 49', energy: ['Lightning Energy SVE'], damage: 10 }],
        hand: ['Water Energy SVE', 'Lightning Energy SVE'],
        deck: ['Water Energy SVE', 'Ralts SIT'],
        discard: ['Water Energy SVE']
      },
      player2: {
        name: 'Agent B',
        active: { card: 'Raichu SIT', energy: ['Lightning Energy SVE'], damage: 10 },
        deck: ['Water Energy SVE', 'Water Energy SVE']
      },
      turn: 2,
      activePlayer: 0
    });
    const state = game.state;
    const player = state.players[0];
    const opponent = state.players[1];
    const activeTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
    const benchTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
    const opponentActiveTarget = { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
    const message = GameMessage.CHOOSE_CARDS as GameMessage;
    const psychicEnergy = player.active.energies.cards[0] as any;
    const prompts = [
      new AlertPrompt(player.id, message),
      new AttachEnergyPrompt(player.id, message, player.hand, PlayerType.BOTTOM_PLAYER, [SlotType.ACTIVE, SlotType.BENCH], { superType: SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }),
      new ChooseAttackPrompt(player.id, message, [opponent.active.getPokemonCard()!], { allowCancel: false }),
      new ChooseCardsPrompt(player, message, player.hand, { superType: SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }),
      // Filter must be respected even when non-matching cards come first.
      new ChooseCardsPrompt(player, message, player.deck, { superType: SuperType.POKEMON }, { allowCancel: false, min: 1, max: 2 }),
      new ChooseEnergyPrompt(player.id, message, [{ card: psychicEnergy, provides: psychicEnergy.provides }], [CardType.PSYCHIC], { allowCancel: false }),
      new ChoosePokemonPrompt(player.id, message, PlayerType.BOTTOM_PLAYER, [SlotType.ACTIVE, SlotType.BENCH], { allowCancel: false, min: 1, max: 1 }),
      new ChoosePrizePrompt(player.id, message, { allowCancel: false, count: 1 }),
      new CoinFlipPrompt(player.id, message),
      new ConfirmCardsPrompt(player.id, message, player.hand.cards),
      new ConfirmPrompt(player.id, message),
      new DiscardEnergyPrompt(player.id, message, PlayerType.BOTTOM_PLAYER, [SlotType.ACTIVE, SlotType.BENCH], { superType: SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }),
      new MoveDamagePrompt(player.id, message, PlayerType.BOTTOM_PLAYER, [SlotType.ACTIVE, SlotType.BENCH], [{ target: activeTarget, damage: 20 }, { target: benchTarget, damage: 10 }], { allowCancel: false, min: 1, max: 1 }),
      new MoveEnergyPrompt(player.id, message, PlayerType.BOTTOM_PLAYER, [SlotType.ACTIVE, SlotType.BENCH], { superType: SuperType.ENERGY }, { allowCancel: false, min: 0, max: 1 }),
      new OrderCardsPrompt(player.id, message, player.hand, { allowCancel: false }),
      new PutDamagePrompt(player.id, message, PlayerType.TOP_PLAYER, [SlotType.ACTIVE], 10, [{ target: opponentActiveTarget, damage: 120 }], { allowCancel: false }),
      new RemoveDamagePrompt(player.id, message, PlayerType.BOTTOM_PLAYER, [SlotType.ACTIVE, SlotType.BENCH], [{ target: activeTarget, damage: 20 }, { target: benchTarget, damage: 10 }], { allowCancel: false, min: 1, max: 1 }),
      new SelectOptionPrompt(player.id, message, ['A', 'B'], { allowCancel: false, defaultValue: 1 }),
      new SelectPrompt(player.id, message, ['A', 'B'], { allowCancel: false, defaultValue: 1 }),
      new ShowCardsPrompt(player.id, message, player.hand.cards),
      new ShowMulliganPrompt(player.id, message, [player.hand.cards]),
      new ShuffleDeckPrompt(player.id),
      new ShufflePrizesPrompt(player.id),
      new WaitPrompt(player.id, 0)
    ];

    for (const prompt of prompts) {
      const raw = resolver.defaultRawResult(state, prompt);
      const decoded = prompt.decode(raw, state);
      expect(prompt.validate(decoded as any, state)).toBe(true, prompt.constructor.name);
    }
  });
});
