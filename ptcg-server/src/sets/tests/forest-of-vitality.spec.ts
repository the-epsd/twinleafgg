import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { PlayCardAction } from '../../game/store/actions/play-card-action';
import { getCardByName, padDeck, setupGame } from './test-helpers';

describe('Forest of Vitality MEG — same-turn Grass chain evolve', () => {
  it('keeps Bayleef evolvable into Meganium after evolving Chikorita this turn', () => {
    const game = setupGame({
      turn: 3,
      player1: {
        active: { card: 'Chikorita M1S' },
        hand: ['Bayleef M1S', 'Meganium M1S'],
        deck: padDeck(10),
      },
      player2: {
        active: { card: 'Ralts SIT' },
        deck: padDeck(10),
      },
    });

    const forest = getCardByName('Forest of Vitality MEG');
    forest.id = 9001;
    game.player1.stadium.cards.push(forest);

    const player = game.state.players[0];
    player.active.pokemonPlayedTurn = 3;

    const bayleefIndex = player.hand.cards.findIndex(c => c.fullName === 'Bayleef M1S');
    const meganium = player.hand.cards.find(c => c.fullName === 'Meganium M1S');
    expect(bayleefIndex).toBeGreaterThanOrEqual(0);
    expect(meganium).toBeDefined();

    game.store.dispatch(new PlayCardAction(player.id, bayleefIndex, {
      player: PlayerType.BOTTOM_PLAYER,
      slot: SlotType.ACTIVE,
      index: 0,
    }));

    expect(player.active.getPokemonCard()?.name).toBe('Bayleef');
    expect(player.active.canEvolveThisTurn).toBe(true);
    expect(player.playableCardIds).toContain(meganium!.id);
  });
});
