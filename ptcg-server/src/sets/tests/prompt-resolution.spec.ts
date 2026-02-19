import { RetreatAction } from '../../game/store/actions/game-actions';
import { EnergyCard } from '../../game/store/card/energy-card';
import { playTrainerCard } from './card-test-helpers';
import { getCardByName, padDeck, setupGame } from './test-helpers';

describe('Test Harness Prompt Resolution', () => {
  it('should pay exact retreat cost when multiple energies are attached', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: { card: 'Ralts (SIT 67)', energy: ['Psychic Energy (SVE 5)', 'Water Energy (SVE 3)'] },
        bench: [{ card: 'Manaphy (BRS 41)' }],
        deck: padDeck(10)
      },
      player2: {
        active: { card: 'Ralts (SIT 67)' },
        deck: padDeck(10)
      }
    });

    const player = game.state.players[0];
    game.store.dispatch(new RetreatAction(player.id, 0));

    expect(player.discard.cards.length).toBe(1);
    expect(player.active.getPokemonCard()?.fullName).toBe('Manaphy (BRS 41)');
  });

  it('should respect different energy type constraints for Mirage Gate', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: { card: 'Ralts (SIT 67)' },
        bench: [{ card: 'Ralts (SIT 67)' }],
        hand: ['Mirage Gate (LOR 163)'],
        deck: ['Lightning Energy (SVE 4)', 'Lightning Energy (SVE 4)', 'Water Energy (SVE 3)', ...padDeck(7)]
      },
      player2: {
        active: { card: 'Ralts (SIT 67)' },
        deck: padDeck(10)
      }
    });

    for (let i = 0; i < 7; i++) {
      const card = getCardByName('Water Energy (SVE 3)');
      card.id = 9000 + i;
      game.state.players[0].lostzone.cards.push(card);
    }

    playTrainerCard(game.store, game.state, 0, 'Mirage Gate (LOR 163)');

    const attachedEnergy = [game.state.players[0].active, ...game.state.players[0].bench]
      .flatMap(slot => slot.energies.cards)
      .filter(card => card instanceof EnergyCard) as EnergyCard[];

    expect(attachedEnergy.length).toBe(2);
    const types = new Set(attachedEnergy.map(card => card.provides[0]));
    expect(types.size).toBe(2);
  });
});
