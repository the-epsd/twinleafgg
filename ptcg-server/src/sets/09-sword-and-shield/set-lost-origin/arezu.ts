import { TrainerType, SuperType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  GameError,
  GameMessage,
  Player,
  PokemonCard,
  State,
  StoreLike,
  TrainerCard,
} from '../../../game';
import { MOVE_CARDS, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Arezu extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'F';
  public set: string = 'LOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '153';
  public name: string = 'Arezu';
  public fullName: string = 'Arezu LOR';
  public text: string =
    "Search your deck for up to 3 Evolution Pokémon that don't have a Rule Box, reveal them, and put them into your hand. Then, shuffle your deck. (Pokémon V, Pokémon-GX, etc. have Rule Boxes.)";

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }

    const otherCards = player.hand.cards.filter((c) => c !== this);
    if (otherCards.length < 1) {
      return false;
    }

    if (player.deck.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      const otherCards = player.hand.cards.filter((c) => c !== this);
      if (otherCards.length < 1) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.hasRuleBox()) {
          blocked.push(index);
        }
        if (card instanceof PokemonCard && (card.evolvesFrom === '' || card.stage === Stage.LV_X)) {
          blocked.push(index);
        }
      });

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        { superType: SuperType.POKEMON },
        { min: 0, max: 3, allowCancel: false, blocked },
      );
    }

    return state;
  }
}
