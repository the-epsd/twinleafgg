import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils, PokemonCard } from '../../game';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';

export class SurvivalCast extends TrainerCard {

  public regulationMark = 'H';

  public trainerType: TrainerType = TrainerType.TOOL;
  
  public set: string = 'TWM';
  
  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '164';
  
  public name = 'Survival Brace';
  
  public fullName = 'Survival Brace TWM';

  public text: string =
    'If the Pokémon this card is attached to has full HP and would be Knocked Out by damage from an opponent\'s attack, that Pokémon is not Knocked Out and its remaining HP becomes 10 instead. Then, discard this card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AfterDamageEffect && effect.target.tool === this) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
        return state;
      }

      const activePokemon = player.active as unknown as PokemonCard;
      const maxHp = activePokemon.hp;

      if (state.phase === GamePhase.ATTACK) {
        if (player.active.damage === 0) {
          if (effect.source.damage >= maxHp) {
            effect.preventDefault;
            effect.damage = maxHp - 10;
          }
        }
      }

      return state;
    }
    return state;
  }
}