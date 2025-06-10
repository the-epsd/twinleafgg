import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS_TO_HAND, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';
import { ChooseCardsPrompt, GameMessage } from '../../game';

export class Skitty extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Important Errands',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a React Energy card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Jump On',
    cost: [C, C],
    damage: 10,
    text: 'Flip a coin. If heads, this attack does 10 damage plus 20 more damage.'
  }];

  public set: string = 'LM';
  public name: string = 'Skitty';
  public fullName: string = 'Skitty LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { name: 'React Energy' },
        { min: 0, max: 1, allowCancel: false }
      ), cards => {
        if (cards.length > 0) {
          MOVE_CARDS_TO_HAND(store, state, player, cards);
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        }

        SHUFFLE_DECK(store, state, player)
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }

    return state;
  }

}
