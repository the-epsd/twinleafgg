import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import {
  StoreLike,
  State,
  StateUtils,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import {
  ApplyWeaknessEffect,
  AfterDamageEffect,
} from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { COPY_ATTACK_FROM_POKEMON_LIST } from '../../../game/store/prefabs/copy-attack-prefabs';

export class MewVMAX extends PokemonCard {
  protected _tags = [CardTag.POKEMON_VMAX, CardTag.FUSION_STRIKE];
  public stage: Stage = Stage.VMAX;
  public evolvesFrom = 'Mew V';
  public cardType: CardType[] = [P];
  public hp: number = 310;
  public weakness = [{ type: D }];
  public retreat = [];

  public attacks = [
    {
      name: 'Cross Fusion Strike',
      cost: [C, C],
      copycatAttack: true,
      damage: 0,
      text: "Choose 1 of your Benched Fusion Strike Pokémon's attacks and use it as this attack.",
    },
    {
      name: 'Max Miracle',
      cost: [P, P],
      damage: 130,
      shredAttack: true,
      text: "This attack's damage isn't affected by any effects on your opponent's Active Pokémon.",
    },
  ];

  public regulationMark = 'E';
  public set: string = 'FST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '114';
  public name: string = 'Mew VMAX';
  public fullName: string = 'Mew VMAX FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const applyWeakness = new ApplyWeaknessEffect(effect, 130);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const fusionStrike = player.bench
        .filter(b => b.cards.length > 0 && b.getPokemonCard()?.hasTag(CardTag.FUSION_STRIKE))
        .map(b => b.getPokemonCard())
        .filter((c): c is PokemonCard => c !== undefined);

      if (fusionStrike.length === 0) {
        return state;
      }

      return COPY_ATTACK_FROM_POKEMON_LIST(store, state, effect as AttackEffect, fusionStrike, {
        disallowCopycatAttack: true,
      });
    }

    return state;
  }
}
