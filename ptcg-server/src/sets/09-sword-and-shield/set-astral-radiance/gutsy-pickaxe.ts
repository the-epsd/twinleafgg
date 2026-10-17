import {
  AttachEnergyPrompt,
  CardList,
  EnergyType,
  GameMessage,
  PlayerType,
  SlotType,
  State,
  StateUtils,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerType,
  Player,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class GutsyPickaxe extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'F';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '145';
  public name: string = 'Gutsy Pickaxe';
  public fullName: string = 'Gutsy Pickaxe ASR';
  public text: string =
    'Reveal the top card of your deck. If that card is a [F] Energy card, attach it to 1 of your Benched Pokémon. If it is not a [F] Energy card, put it into your hand.';

  public canPlay(_store: StoreLike, _state: State, _player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const temp = new CardList();

      MOVE_CARDS(store, state, player.deck, temp, { count: 1, sourceCard: this });

      if (temp.cards.length === 0) {
        return state;
      }

      const revealed = temp.cards.slice();

      // Check if the revealed card is a basic Fighting Energy
      const energyCardsDrawn = temp.cards.filter((card) => {
        return (
          card.superType === SuperType.ENERGY &&
          card.energyType === EnergyType.BASIC &&
          card.name === 'Fighting Energy'
        );
      });

      SHOW_CARDS_TO_PLAYER(store, state, opponent, revealed);

      // Not a [F] Energy: put it into your hand
      if (energyCardsDrawn.length === 0) {
        SHOW_CARDS_TO_PLAYER(store, state, player, revealed);
        MOVE_CARDS(store, state, temp, player.hand, { cards: revealed, sourceCard: this });
        return state;
      }

      // [F] Energy: attach it to 1 of your Benched Pokémon
      return store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          temp, // Only show drawn energies
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          { min: 0, allowCancel: false, max: energyCardsDrawn.length },
        ),
        (transfers) => {
          if (transfers) {
            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              MOVE_CARDS(store, state, temp, target, {
                cards: [transfer.card],
                sourceCard: this,
              });
            }
            temp.cards.forEach((card) => {
              MOVE_CARDS(store, state, temp, player.hand, {
                cards: [card],
                sourceCard: this,
              });
            });
          }
          return state;
        },
      );
    }
    return state;
  }
}
