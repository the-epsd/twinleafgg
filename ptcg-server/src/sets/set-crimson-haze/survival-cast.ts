import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class SurvivalCast extends TrainerCard {

  public regulationMark = 'H';

  public trainerType: TrainerType = TrainerType.TOOL;
  
  public set: string = 'SV5';
  
  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '59';
  
  public name = 'Survival Cast';
  
  public fullName = 'Survival Cast SV5';

  public text: string =
    'If the Pokémon this card is attached to has full HP and would be Knocked Out by damage from an opponent\'s attack, that Pokémon is not Knocked Out and its remaining HP becomes 10 instead. Then, discard this card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && effect.target.tool === this) {
      const player = effect.player;

      if (player.active.damage == 0 && effect.damage >= player.active.hp) {
        effect.damage = player.active.hp - 10;
        player.active.hp = 10;

        player.active.tool?.cards.moveTo(player.discard);
      }
      return state;
    }
    return state;

  }
}
