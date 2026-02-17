import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Snover extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Ice Shard',
      cost: [W, C],
      damage: 20,
      damageCalculation: '+' as '+',
      text: 'If your opponent\'s Active Pokémon is a Fighting Pokémon, this attack does 40 more damage.'
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '37';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Snover';
  public fullName: string = 'Snover UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Ice Shard
    // Ref: set-ultra-prism/electivire.ts (Steel Short - conditional damage based on type)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkType = new CheckPokemonTypeEffect(opponent.active);
      store.reduceEffect(state, checkType);

      if (checkType.cardTypes.includes(CardType.FIGHTING)) {
        effect.damage += 40;
      }
    }

    return state;
  }
}
