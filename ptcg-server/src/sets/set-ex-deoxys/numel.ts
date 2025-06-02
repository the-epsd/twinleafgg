import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { IS_POKEBODY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Numel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 40;
  public weakness = [{ type: W }];
  public retreat = [C];

  public powers = [{
    name: 'Dense',
    powerType: PowerType.POKEBODY,
    text: 'Any damage done to Numel by attacks from Evolved Pokémon (both yours and your opponent\'s) is reduced by 20 (after applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Ram',
      cost: [C],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'DX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';
  public name: string = 'Numel';
  public fullName: string = 'Numel DX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if ((effect instanceof DealDamageEffect || effect instanceof PutDamageEffect) && effect.target.getPokemonCard() === this && !IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
      if (effect.source.getPokemons().length > 1) {
        effect.damage -= 20;
      }
    }

    return state;
  }
}

