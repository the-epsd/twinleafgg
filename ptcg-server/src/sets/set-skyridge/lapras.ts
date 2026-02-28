import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, MOVE_CARD_TO, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { GameMessage } from '../../game/game-message';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike, TrainerType } from '../../game';
export class Lapras extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Assist',
    cost: [C, C],
    damage: 0,
    text: 'Search your deck for a Supporter card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Hypnoblast',
    cost: [W, W, C],
    damage: 30,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep.'
  }];

  public set: string = 'SK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '71';
  public name: string = 'Lapras';
  public fullName: string = 'Lapras SK';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        return state;
      }

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
        { min: 0, max: 1 }
      ), cards => {
        if (!cards || cards.length === 0) {
          return state;
        }

        SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        cards.forEach(card => MOVE_CARD_TO(state, card, player.hand));
        SHUFFLE_DECK(store, state, player);
      });
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    return state;
  }
}