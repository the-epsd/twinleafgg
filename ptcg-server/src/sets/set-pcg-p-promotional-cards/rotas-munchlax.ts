import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { IS_POKEBODY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

export class RotasMunchlax extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Thick Fat',
    powerType: PowerType.POKEBODY,
    text: 'Any damage done to Rota\'s Munchlax by attacks from [R] Pokémon and [W] Pokémon is reduced by 30 (after applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Rollout',
      cost: [C, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'PCGP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '88';
  public name: string = 'Rota\'s Munchlax';
  public fullName: string = 'Rota\'s Munchlax PCGP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if ((effect instanceof DealDamageEffect || effect instanceof PutDamageEffect) && effect.target.getPokemonCard() === this && !IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkPokemonTypeEffect);

      if (checkPokemonTypeEffect.cardTypes.includes(CardType.WATER) || checkPokemonTypeEffect.cardTypes.includes(CardType.FIRE)) {
        effect.damage -= 30;
      }
    }

    return state;
  }
}

