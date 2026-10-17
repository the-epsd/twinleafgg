import {
  AttachEnergyPrompt,
  CardList,
  EnergyCard,
  GameError,
  GameMessage,
  PlayerType,
  SlotType,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  Player,
} from '../../../game';
import { EnergyType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Ether extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'PLS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '121';
  public name: string = 'Ether';
  public fullName: string = 'Ether PLS';
  public text: string =
    'Reveal the top card of your deck. If that card is a basic Energy card, attach it to 1 of your Pokémon. If it is not a basic Energy card, return it to the top of your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });
      effect.preventDefault = true;

      const temp = new CardList();

      MOVE_CARDS(store, state, player.deck, temp, { count: 1, sourceCard: this });

      SHOW_CARDS_TO_PLAYER(store, state, opponent, temp.cards);

      const isEnergy =
        temp.cards[0] instanceof EnergyCard && temp.cards[0].energyType === EnergyType.BASIC;

      if (isEnergy) {
        return store.prompt(
          state,
          new AttachEnergyPrompt(
            player.id,
            GameMessage.ATTACH_ENERGY_CARDS,
            temp,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH, SlotType.ACTIVE],
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
            { min: 1, max: 1 },
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
            }

            return state;
          },
        );
      }

      temp.moveToTopOfDestination(player.deck);
    }
    return state;
  }
}
