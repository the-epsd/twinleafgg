import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardEnergyPrompt } from '../../../game/store/prompts/discard-energy-prompt';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, PlayerType, SlotType, StateUtils } from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class EnergyReset extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'FCO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '98';
  public name: string = 'Energy Reset';
  public fullName: string = 'Energy Reset FCO';
  public text: string = 'Put as many Energy attached to your Pokémon as you like into your hand.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    let hasEnergy = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      if (cardList.cards.some((c) => c.superType === SuperType.ENERGY)) {
        hasEnergy = true;
      }
    });
    return hasEnergy;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (!this.canPlay(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      return store.prompt(
        state,
        new DiscardEnergyPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { superType: SuperType.ENERGY },
          { allowCancel: false, min: 1, max: undefined },
        ),
        (transfers) => {
          // Move selected energy cards to hand instead of discard
          (transfers || []).forEach((transfer) => {
            const source = StateUtils.getTarget(state, player, transfer.from);
            MOVE_CARDS(store, state, source, player.hand, {
              cards: [transfer.card],
              sourceCard: this,
            });
          });
        },
      );
    }

    return state;
  }
}
