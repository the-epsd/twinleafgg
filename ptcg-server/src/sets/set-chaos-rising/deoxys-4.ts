import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { ConfirmPrompt, GameMessage, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, DRAW_CARDS_UNTIL_CARDS_IN_HAND } from '../../game/store/prefabs/prefabs';

export class Deoxys4 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public attacks = [
    {
      name: 'Psy Speed',
      cost: [P],
      damage: 30,
      text: 'You may draw cards until you have 5 cards in your hand.'
    }
  ];

  public regulationMark: string = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';
  public name: string = 'Deoxys';
  public fullName: string = 'Deoxys M4 34';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack: Psy Speed - optional draw until 5 cards
    // Ref: set-chilling-reign/tapu-fini.ts (optional effect with ConfirmPrompt)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_DRAW_CARDS
      ), wantToDraw => {
        if (wantToDraw) {
          DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 5);
        }
      });
    }

    return state;
  }
}
