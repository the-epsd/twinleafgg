import { CardTag, CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED,
  YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED,
} from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Tentacruel extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Tentacool';
  public cardType: CardType[] = [P];
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Void Tentacles',
    cost: [C],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Confused and Poisoned.'
  },
  {
    name: 'Paranormal',
    cost: [P, C, C],
    damage: 70,
    text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Ultra Beasts.'
  }];

  public set: string = 'TEU';
  public setNumber: string = '61';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tentacruel';
  public fullName: string = 'Tentacruel TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Void Tentacles
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
    }

    // Paranormal
    if (WAS_ATTACK_USED(effect, 1, this)) {
      PREVENT_DAMAGE(store, state, effect, this, { sourceTags: [CardTag.ULTRA_BEAST] });
    }

    return state;
  }
}
