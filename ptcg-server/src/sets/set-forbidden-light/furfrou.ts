import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, DRAW_CARDS_UNTIL_CARDS_IN_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Furfrou extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Return',
    cost: [C],
    damage: 20,
    text: 'You may draw cards until you have 5 cards in your hand.'
  }];

  public set: string = 'FLI';
  public name: string = 'Furfrou';
  public fullName: string = 'Furfrou FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '99';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 5);
        }
      })
    }

    return state;
  }
}