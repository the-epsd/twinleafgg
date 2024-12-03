import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { State, StateUtils, GameLog, PlayerType } from '../../game';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

// interface PokemonItem {
//   playerNum: number;
//   cardList: PokemonCardList;
// }

export class SurvivalCast extends TrainerCard {

  public regulationMark = 'H';

  public trainerType: TrainerType = TrainerType.TOOL;

  public tags = [CardTag.ACE_SPEC];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '164';

  public name = 'Survival Brace';

  public fullName = 'Survival Brace TWM';

  private canDiscard = false;

  public text: string =
    'If the Pokémon this card is attached to has full HP and would be Knocked Out by damage from an opponent\'s attack, that Pokémon is not Knocked Out and its remaining HP becomes 10 instead. Then, discard this card.';


  public reduceEffect(store: any, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.tool === this && effect.target.damage == 0) {
      const player = StateUtils.findOwner(state, effect.target);
      const checkHpEffect = new CheckHpEffect(player, effect.target);
      store.reduceEffect(state, checkHpEffect);

      if (effect.target.damage === 0 && effect.damage >= checkHpEffect.hp) {

        try {
          const toolEffect = new ToolEffect(player, this);
          store.reduceEffect(state, toolEffect);
        } catch {
          return state;
        }

        effect.preventDefault = true;
        effect.target.damage = checkHpEffect.hp - 10;
        store.log(state, GameLog.LOG_PLAYER_PLAYS_TOOL, { card: this.name });
        this.canDiscard = true;
      }

      if (this.canDiscard) {

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
          if (cardList.cards.includes(this)) {
            try {
              const toolEffect = new ToolEffect(player, this);
              store.reduceEffect(state, toolEffect);
            } catch {
              return state;
            }

            cardList.moveCardTo(this, player.discard);
            cardList.tool = undefined;
          }
        });
      }
    }
    return state;
  }
}