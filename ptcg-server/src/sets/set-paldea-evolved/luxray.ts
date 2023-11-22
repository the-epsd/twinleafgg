import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';


export class Luxray extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Luxio';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 150;

  public weakness = [ { type:CardType.FIGHTING } ];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Swelling Flash',
    powerType: PowerType.ABILITY,
    text: '' 
  }];

  public attacks = [{

    name: 'Wild Charge',
    cost: [ CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 180,
    text: 'This Pokémon also does 20 damage to itself.'
  }];

  public set: string = 'PAL';

  public set2: string = 'paldeaevolved';

  public setNumber: string = '71';

  public name: string = 'Luxray';

  public fullName: string = 'Luxray PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect
        && effect.power.powerType === PowerType.ABILITY
        && effect.power.name !== 'Swelling Flash') {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
    
      if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {

        this.stage = Stage.BASIC;
      }
      return state;
    }
    return state;
  }
}