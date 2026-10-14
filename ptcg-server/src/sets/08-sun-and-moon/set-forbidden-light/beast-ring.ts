import {
  AttachEnergyPrompt,
  CardTarget,
  GameError,
  GameMessage,
  Player,
  PlayerType,
  SlotType,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
} from '../../../game';
import { CardTag, EnergyType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class BeastRing extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '102';
  public name: string = 'Beast Ring';
  public fullName: string = 'Beast Ring FLI';
  public text: string =
    'You can play this card only if your opponent has exactly 3 or 4 Prize cards remaining.\n\n' +
    'Search your deck for up to 2 basic Energy cards and attach them to 1 of your Ultra Beasts. Then, shuffle your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);
    const prizesLeft = opponent.getPrizeLeft();
    if (prizesLeft !== 3 && prizesLeft !== 4) {
      return false;
    }

    let ultraBeastInPlay = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card) => {
      if (card.hasTag(CardTag.ULTRA_BEAST)) {
        ultraBeastInPlay = true;
      }
    });
    return ultraBeastInPlay;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (!this.canPlay(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (!card.hasTag(CardTag.ULTRA_BEAST)) {
          blocked.push(target);
        }
      });

      store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          player.deck,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          { allowCancel: false, min: 0, max: 2, blockedTo: blocked, sameTarget: true },
        ),
        (transfers) => {
          transfers = transfers || [];
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            MOVE_CARDS(store, state, player.deck, target, { cards: [transfer.card], sourceCard: this });
          }

          return SHUFFLE_DECK(store, state, player);
        },
      );
    }

    return state;
  }
}
