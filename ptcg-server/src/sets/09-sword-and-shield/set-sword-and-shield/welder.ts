import { CardType, EnergyType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../../game/store/effects/play-card-effects';
import {
  TrainerCard,
  EnergyCard,
  StoreLike,
  State,
  GameError,
  GameMessage,
  AttachEnergyPrompt,
  PlayerType,
  SlotType,
  Player,
  StateUtils,
} from '../../../game';
import { MOVE_CARDS, DRAW_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Welder extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber = '189';
  public name: string = 'Welder';
  public fullName: string = 'Welder UNB';
  public text: string =
    'Attach up to 2 [R] Energy cards from your hand to 1 of your Pokémon. If you do, draw 3 cards.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    const hasEnergyInHand = player.hand.cards.some((c) => {
      return (
        c instanceof EnergyCard &&
        c.energyType === EnergyType.BASIC &&
        c.provides.includes(CardType.FIRE)
      );
    });
    if (!hasEnergyInHand) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some((c) => {
        return (
          c instanceof EnergyCard &&
          c.energyType === EnergyType.BASIC &&
          c.provides.includes(CardType.FIRE)
        );
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      effect.preventDefault = true;
      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      return store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          player.hand,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
          { min: 1, max: 2, allowCancel: false, sameTarget: true },
        ),
        (transfers) => {
          transfers = transfers || [];
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            const energyCard = transfer.card as EnergyCard;
            const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
            store.reduceEffect(state, attachEnergyEffect);
          }
          if (transfers.length > 0) {
            DRAW_CARDS(store, state, player, 3);
          }
          MOVE_CARDS(store, state, player.supporter, player.discard, {
            cards: [this],
            sourceCard: this,
          });
        },
      );
    }

    return state;
  }
}
