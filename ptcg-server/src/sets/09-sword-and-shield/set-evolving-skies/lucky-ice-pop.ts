import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { COIN_FLIP_PROMPT, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class LuckyIcePop extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark: string = 'E';
  public set: string = 'EVS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '150';
  public name: string = 'Lucky Ice Pop';
  public fullName: string = 'Lucky Ice Pop EVS';
  public text: string =
    'Heal 20 damage from your Active Pokémon. If you healed any damage in this way, flip a coin. If heads, put this Lucky Ice Pop into your hand instead of the discard pile. You may play any number of Item cards during your turn.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // For Item cards, PlayItemEffect already moved the card from hand to supporter
      // before TrainerEffect fires. We must always explicitly move it to its final destination.
      effect.preventDefault = true;

      // Check if there's any damage to heal before healing
      const hadDamage = player.active.damage > 0;

      // Heal 20 damage from active
      const healEffect = new HealEffect(player, player.active, 20);
      store.reduceEffect(state, healEffect);

      // Only do the coin flip if we healed damage (active had damage on it)
      if (hadDamage) {
        COIN_FLIP_PROMPT(store, state, player, (result) => {
          if (result) {
            // Heads: return to hand instead of discard
            MOVE_CARDS(store, state, player.supporter, player.hand, {
              cards: [effect.trainerCard],
              sourceCard: this,
            });
          } else {
            // Tails: discard normally
          }
        });
      } else {
        // No damage to heal: discard the card normally
      }
    }

    return state;
  }
}
