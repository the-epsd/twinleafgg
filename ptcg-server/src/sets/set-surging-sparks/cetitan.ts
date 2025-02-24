import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { PowerType } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Cetitan extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Cetoddle';
  public cardType: CardType = W;
  public hp: number = 180;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Solid Body',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Dangerous Mouth',
    cost: [W, C, C, C],
    damage: 150,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '54';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cetitan';
  public fullName: string = 'Cetitan SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Solid Body
    if (effect instanceof PutDamageEffect && effect.target.getPokemonCard() === this){
      if (IS_ABILITY_BLOCKED(store, state, effect.opponent, this)){ return state; }
      effect.damage -= 30;
    }

    return state;
  }
}