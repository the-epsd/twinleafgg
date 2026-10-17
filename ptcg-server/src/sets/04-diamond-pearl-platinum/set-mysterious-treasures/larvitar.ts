import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, CONFIRMATION_PROMPT, DISCARD_TOP_X_CARDS_FROM_YOUR_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Larvitar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G, value: +10 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Mountain Bite',
    cost: [F],
    damage: 10,
    damageCalculation: '+',
    text: 'You may discard the top card of your deck. If you do, this attack does 10 damage plus 10 more damage and Larvitar is now Asleep.'
  },
  {
    name: 'Hammer In',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';
  public name: string = 'Larvitar';
  public fullName: string = 'Larvitar MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mountain Bite
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.deck.cards.length === 0) {
        return state;
      }
      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          DISCARD_TOP_X_CARDS_FROM_YOUR_DECK(store, state, player, 1, this, effect.attack);
          effect.damage += 10;
          ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, player, this);
        }
      });
    }

    return state;
  }
}
