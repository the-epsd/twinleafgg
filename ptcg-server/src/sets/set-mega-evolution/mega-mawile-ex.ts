import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game';
import { DEAL_MORE_DAMAGE_FOR_EACH_PRIZE_CARD_TAKEN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MegaMawileEx extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public hp: number = 270;
  public cardType: CardType = M;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Doom Period',
    cost: [M, M],
    damage: 80,
    damageCalculation: 'x',
    text: 'This attack does 80 damage for each Prize card you have taken.'
  },
  {
    name: 'Big Bite',
    cost: [M, M, C],
    damage: 260,
    text: 'If your opponent\'s Active Pokémon already has any damage counters on it before this attack does damage, this attack does 30 damage instead.'
  }];

  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '94';
  public name: string = 'Mega Mawile ex';
  public fullName: string = 'Mega Mawile ex M1L';
  public regulationMark: string = 'I';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.damage = 0;
      DEAL_MORE_DAMAGE_FOR_EACH_PRIZE_CARD_TAKEN(effect, state, 80);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.damage > 0) {
        effect.damage = 30;
      }
    }

    return state;
  }


}