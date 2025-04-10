import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_POKEBODY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Kabuto extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Mysterious Fossil';
  public cardType: CardType = F;
  public hp: number = 50;
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [{
    name: 'Thick Shell',
    powerType: PowerType.POKEBODY,
    text: 'All damage done by attacks to Kabuto from Evolved Pokémon is reduced by 10 (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Scratch',
    cost: [F, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'SK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Kabuto';
  public fullName: string = 'Kabuto SK';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect && effect.target.getPokemonCard() === this && !IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
      const opponent = effect.player;
      if (opponent.active.getPokemons().length > 1) {
        effect.damage -= 10;
      }
    }

    return state;
  }
}