import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';

export class Cryogonal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Icy Wind',
      cost: [W],
      damage: 10,
      text: 'The Defending Pokemon is now Asleep.'
    },
    {
      name: 'Ice Shard',
      cost: [W, C],
      damage: 30,
      damageCalculation: '+',
      text: 'If the Defending Pokemon is a Fighting Pokemon, this attack does 40 more damage.'
    }
  ];

  public set: string = 'NVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  public name: string = 'Cryogonal';
  public fullName: string = 'Cryogonal NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const defendingPokemon = opponent.active.getPokemonCard();

      if (defendingPokemon && defendingPokemon.cardType === CardType.FIGHTING) {
        (effect as AttackEffect).damage += 40;
      }
    }

    return state;
  }
}
