import { TrainerType, SuperType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  State,
  StoreLike,
  TrainerCard,
  StateUtils,
  GameError,
  GameMessage,
  PlayerType,
  SlotType,
  Card,
  CardTarget,
  Player,
  ChoosePokemonPrompt,
  ChooseCardsPrompt,
} from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class WaitAndSeeHammer extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '192';
  public name: string = 'Wait and See Hammer';
  public fullName: string = 'Wait and See Hammer LOT';
  public text: string =
    "You can use this card only if you go second, and only on your first turn. Discard an Energy from 1 of your opponent's Pokémon.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (state.turn !== 2) {
      return false;
    }

    const opponent = StateUtils.getOpponent(state, player);
    let hasEnergy = false;
    opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
      if (cardList.cards.some((c) => c.superType === SuperType.ENERGY)) {
        hasEnergy = true;
      }
    });
    return hasEnergy;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!this.canPlay(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Block Pokemon without energy
      const blocked: CardTarget[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (!cardList.cards.some((c) => c.superType === SuperType.ENERGY)) {
          blocked.push(target);
        }
      });

      store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false, blocked },
        ),
        (targets) => {
          if (!targets || targets.length === 0) {
            return;
          }
          const target = targets[0];

          store.prompt(
            state,
            new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_DISCARD,
              target,
              { superType: SuperType.ENERGY },
              { min: 1, max: 1, allowCancel: false },
            ),
            (selected: Card[]) => {
              const cards = selected || [];
              cards.forEach((card) => {
                MOVE_CARDS(store, state, target, opponent.discard, {
                  cards: [card],
                  sourceCard: this,
                });
              });
            },
          );
        },
      );
    }

    return state;
  }
}
