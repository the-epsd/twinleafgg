import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Misdreavus extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [P];
  public weakness = [{ type: D, value: +10 }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Show Off',
    cost: [],
    damage: 0,
    text: 'Search your deck for a basic Energy card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Payback',
    cost: [P],
    damage: 10,
    damageCalculation: '+',
    text: 'If your opponent has only 1 Prize card left, this attack does 10 damage plus 20 more damage.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';
  public name: string = 'Misdreavus';
  public fullName: string = 'Misdreavus LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Show Off
    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, effect.player, this, { superType: SuperType.ENERGY, energyType: EnergyType.BASIC }, { min: 1, max: 1, allowCancel: false }, this.attacks[0]);
    }

    // Payback
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const prizesLeft = opponent.prizes.filter(p => p.cards.length > 0).length;
      if (prizesLeft === 1) {
        effect.damage += 20;
      }
    }

    return state;
  }
}
