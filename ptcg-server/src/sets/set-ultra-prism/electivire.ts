import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

export class Electivire extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Electabuzz';
  public cardType: CardType = L;
  public hp: number = 140;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Steel Short',
      cost: [L, C, C],
      damage: 60,
      text: 'If your opponent\'s Active Pokémon is a Metal Pokémon, it is now Paralyzed.'
    },
    {
      name: 'Volt Knuckle',
      cost: [L, L, C, C],
      damage: 130,
      text: ''
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '44';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Electivire';
  public fullName: string = 'Electivire UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Steel Short
    // Ref: AGENTS-patterns.md (conditional paralyzed based on type)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkType = new CheckPokemonTypeEffect(opponent.active);
      store.reduceEffect(state, checkType);

      if (checkType.cardTypes.includes(CardType.METAL)) {
        YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
      }
    }

    return state;
  }
}
