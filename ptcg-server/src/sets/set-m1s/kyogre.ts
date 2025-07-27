import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { EnergyCard } from '../../game';
import { MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Kyogre extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 150;
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Riptide',
    cost: [W],
    damage: 20,
    damageCalculation: 'x',
    text: 'This attack does 20 damage for each [W] Energy card in your discard pile. Then, shuffle those cards into your deck.'
  },
  {
    name: 'Swirling Waves',
    cost: [W, W, C],
    damage: 130,
    text: 'Discard 2 Energy from this Pokémon.'
  }];

  public set: string = 'M1S';
  public name: string = 'Kyogre';
  public fullName: string = 'Kyogre M1S';
  public setNumber: string = '16';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Surging Flames
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      // counting the energies
      const energiesInDiscard = player.discard.cards.filter(c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.name === 'Water Energy');
      if (energiesInDiscard.length === 0) {
        return state;
      }

      effect.damage = 20 * energiesInDiscard.length;
      // slapping those energies back into the deck
      MOVE_CARDS(store, state, player.discard, player.deck, { cards: energiesInDiscard });
      SHUFFLE_DECK(store, state, player);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
    }

    return state;
  }
}