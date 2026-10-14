import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, SuperType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Crossceiver extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark: string = 'E';
  public set: string = 'FST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '231';
  public name: string = 'Crossceiver';
  public fullName: string = 'Crossceiver FST 231';
  public text: string =
    'You must play 2 Crossceiver cards at once. (This effect works one time for 2 cards.) Put a Pokémon or a Supporter card from your discard pile into your hand. You may play any number of Item cards during your turn.';
  protected _tags = [CardTag.FUSION_STRIKE];

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.hand.cards.filter((c) => c.name === this.name).length < 2) {
      return false;
    }

    const hasTarget = player.discard.cards.some((c) => {
      if (c.superType === SuperType.POKEMON) {
        return true;
      }
      if (c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER) {
        return true;
      }
      return false;
    });

    if (!hasTarget) {
      return false;
    }

    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const name = effect.trainerCard.name;

      // Must have another Crossceiver in hand besides this one
      const second = player.hand.cards.find((c) => {
        return c.name === name && c !== effect.trainerCard;
      });
      if (second === undefined) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Check if discard has any Pokemon or Supporter cards
      const hasTarget = player.discard.cards.some((c) => {
        if (c.superType === SuperType.POKEMON) {
          return true;
        }
        if (c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER) {
          return true;
        }
        return false;
      });

      if (!hasTarget) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      effect.preventDefault = true;
      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: effect.trainerCard,
      });

      // Discard the second Crossceiver
      MOVE_CARDS(store, state, player.hand, player.discard, {
        cards: [second],
        sourceCard: effect.trainerCard,
      });

      // Block all cards that aren't Pokemon or Supporter
      const blocked: number[] = [];
      player.discard.cards.forEach((card, index) => {
        const isPokemon = card.superType === SuperType.POKEMON;
        const isSupporter =
          card instanceof TrainerCard && card.trainerType === TrainerType.SUPPORTER;
        if (!isPokemon && !isSupporter) {
          blocked.push(index);
        }
      });

      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        effect.trainerCard,
        {},
        { min: 1, max: 1, allowCancel: false, blocked },
      );
    }

    return state;
  }
}
