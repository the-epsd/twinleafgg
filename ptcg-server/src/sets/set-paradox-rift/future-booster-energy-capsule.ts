import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class FutureBoosterEnergyCapsule extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public regulationMark = 'G';

  public tags = [ CardTag.FUTURE ];

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '62';

  public set: string = 'PAR';

  public name: string = 'Future Booster Energy Capsule';

  public fullName: string = 'Future Booster Energy Capsule PAR';

  public text: string =
    'The Future Pokémon this card is attached to has no Retreat Cost, and the attacks it uses do 20 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (this instanceof PokemonCard && this.tags.includes(CardTag.FUTURE)) {
      if (effect instanceof CheckRetreatCostEffect && effect.player.active.tool === this) {
        effect.cost = [];
      }
    
      if (effect instanceof AttackEffect && effect.player.active.tool === this) {
        effect.damage += 20; 
      }
    
    }
    
    return state;
    
  }
    
}