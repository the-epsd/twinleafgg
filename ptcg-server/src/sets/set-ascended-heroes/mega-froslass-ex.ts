import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';

export class MegaFroslassex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Snorunt';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = W;
  public hp: number = 310;
  public weakness = [{ type: M }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Rebellion',
    cost: [W],
    damage: 50,
    damageCalculation: 'x',
    text: '50x damage. This attack does 50 damage times the number of cards in your opponent\'s hand.'
  },
  {
    name: 'Absolute Snow',
    cost: [W, C, C],
    damage: 150,
    text: '150 damage. Your opponent\'s Active Pokemon is now Asleep.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Mega Froslass ex';
  public fullName: string = 'Mega Froslass ex M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rebellion attack - 50x damage based on opponent's hand size
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const handCount = opponent.hand.cards.length;
      effect.damage = 50 * handCount;
    }

    // Absolute Snow attack - 150 damage and put opponent's Active Pokemon to sleep
    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    return state;
  }
}

