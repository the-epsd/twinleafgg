import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';

export class Thwackey extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 90;
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public weakness = [{ type: CardType.FIRE }];
  public evolvesFrom = 'Grookey';

  public powers = [{
    name: 'Lay of the Land',
    powerType: PowerType.ABILITY,
    text: 'If you have a Stadium in play, this Pokemon has no Retreat Cost.'
  }];

  public attacks = [
    {
      name: 'Branch Poke',
      cost: [CardType.COLORLESS],
      damage: 20,
      text: ''
    }
  ];

  public regulationMark: string = 'D';
  public set: string = 'SHF';
  public name: string = 'Thwackey';
  public fullName: string = 'Thwackey SHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Lay of the Land (passive - no retreat cost if any stadium is in play)
    // Ref: set-rebel-clash/cinderace-v.ts (Field Runner - CheckRetreatCostEffect + getStadiumCard)
    if (effect instanceof CheckRetreatCostEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Any stadium in play (opponent's or player's) satisfies the condition
      if (StateUtils.getStadiumCard(state) !== undefined) {
        effect.cost = [];
      }
    }
    return state;
  }
}