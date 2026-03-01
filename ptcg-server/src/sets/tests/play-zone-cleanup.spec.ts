import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ChooseCardsPromptType } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPromptType } from '../../game/store/prompts/choose-pokemon-prompt';
import { NestBall } from '../set-scarlet-and-violet/nest-ball';
import { UltraBall } from '../set-scarlet-and-violet/ultra-ball';
import { endTurn, playTrainerCard, zoneContains } from './card-test-helpers';
import { padDeck, setupGame } from './test-helpers';

describe('Play Zone Cleanup', () => {
  it('keeps Counter Catcher in play zone while target prompt is pending, then discards after resolution', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: { card: 'Ralts SIT' },
        hand: ['Counter Catcher PAR'],
        deck: padDeck(10),
        prizeCount: 6
      },
      player2: {
        active: { card: 'Ralts SIT' },
        bench: [{ card: 'Manaphy BRS' }],
        deck: padDeck(10),
        prizeCount: 5
      }
    });

    game.overridePrompt(ChoosePokemonPromptType, (_prompt, state) => {
      const player = state.players[0];
      expect(player.supporter.cards.some(c => c.fullName === 'Counter Catcher PAR')).toBe(true);
      return [{ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 }];
    });

    playTrainerCard(game.store, game.state, 0, 'Counter Catcher PAR');

    expect(zoneContains(game.state, 0, 'discard', 'Counter Catcher PAR')).toBe(true);
    expect(game.state.players[0].supporter.cards.length).toBe(0);
  });

  it('keeps Boss\'s Orders in play zone while prompt is pending, then discards after resolution', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: { card: 'Ralts SIT' },
        hand: ['Boss\'s Orders PAL'],
        deck: padDeck(10)
      },
      player2: {
        active: { card: 'Ralts SIT' },
        bench: [{ card: 'Manaphy BRS' }],
        deck: padDeck(10)
      }
    });

    game.overridePrompt(ChoosePokemonPromptType, (_prompt, state) => {
      const player = state.players[0];
      expect(player.supporter.cards.some(c => c.fullName === 'Boss\'s Orders PAL')).toBe(true);
      return [{ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 }];
    });

    playTrainerCard(game.store, game.state, 0, 'Boss\'s Orders PAL');

    expect(zoneContains(game.state, 0, 'discard', 'Boss\'s Orders PAL')).toBe(true);
    expect(game.state.players[0].supporter.cards.length).toBe(0);
  });

  it('supports optional end-turn supporter cleanup rule toggle', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: { card: 'Ralts SIT' },
        hand: ['Boss\'s Orders PAL'],
        deck: padDeck(10)
      },
      player2: {
        active: { card: 'Ralts SIT' },
        bench: [{ card: 'Manaphy BRS' }],
        deck: padDeck(10)
      }
    });
    game.state.rules.supporterCleanupAtEndTurn = true;

    game.overridePrompt(ChoosePokemonPromptType, (_prompt, state) => {
      const player = state.players[0];
      expect(player.supporter.cards.some(c => c.fullName === 'Boss\'s Orders PAL')).toBe(true);
      return [{ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 }];
    });

    playTrainerCard(game.store, game.state, 0, 'Boss\'s Orders PAL');

    expect(game.state.players[0].supporter.cards.some(c => c.fullName === 'Boss\'s Orders PAL')).toBe(true);
    expect(zoneContains(game.state, 0, 'discard', 'Boss\'s Orders PAL')).toBe(false);

    endTurn(game.store, game.state);

    expect(zoneContains(game.state, 0, 'discard', 'Boss\'s Orders PAL')).toBe(true);
    expect(game.state.players[0].supporter.cards.length).toBe(0);
  });

  it('keeps Nest Ball in play zone during deck prompt, then discards on completion', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: { card: 'Ralts SIT' },
        hand: ['Counter Catcher PAR'],
        deck: ['Manaphy BRS', ...padDeck(9)]
      },
      player2: {
        active: { card: 'Ralts SIT' },
        deck: padDeck(10)
      }
    });
    const placeholder = game.state.players[0].hand.cards[0];
    const nestBall = new NestBall();
    nestBall.id = placeholder.id;
    game.state.players[0].hand.cards[0] = nestBall;

    game.overridePrompt(ChooseCardsPromptType, (_prompt, state) => {
      const player = state.players[0];
      expect(player.supporter.cards.some(c => c.fullName === 'Nest Ball SVI')).toBe(true);
      return [0];
    });

    playTrainerCard(game.store, game.state, 0, 'Nest Ball SVI');

    expect(zoneContains(game.state, 0, 'discard', 'Nest Ball SVI')).toBe(true);
    expect(game.state.players[0].supporter.cards.length).toBe(0);
  });

  it('keeps Ultra Ball in play zone during prompts and still discards cost cards immediately', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: { card: 'Ralts SIT' },
        hand: ['Counter Catcher PAR', 'Water Energy SVE', 'Lightning Energy SVE'],
        deck: ['Manaphy BRS', ...padDeck(9)]
      },
      player2: {
        active: { card: 'Ralts SIT' },
        deck: padDeck(10)
      }
    });
    const placeholder = game.state.players[0].hand.cards[0];
    const ultraBall = new UltraBall();
    ultraBall.id = placeholder.id;
    game.state.players[0].hand.cards[0] = ultraBall;

    game.overridePrompt(ChooseCardsPromptType, (_prompt, state) => {
      const player = state.players[0];
      expect(player.supporter.cards.some(c => c.fullName === 'Ultra Ball SVI')).toBe(true);
      return [0, 1];
    });

    playTrainerCard(game.store, game.state, 0, 'Ultra Ball SVI');

    expect(zoneContains(game.state, 0, 'discard', 'Ultra Ball SVI')).toBe(true);
    expect(zoneContains(game.state, 0, 'discard', 'Water Energy SVE')).toBe(true);
    expect(zoneContains(game.state, 0, 'discard', 'Lightning Energy SVE')).toBe(true);
    expect(game.state.players[0].supporter.cards.length).toBe(0);
  });
});
