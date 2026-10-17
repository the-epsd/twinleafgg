import { CardTag, EnergyType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, AttachEnergyPrompt, CardTarget, PlayerType, SlotType, StateUtils } from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class MegaTurbo extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'ROS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '86';
  public name: string = 'Mega Turbo';
  public fullName: string = 'Mega Turbo ROS';
  public text: string =
    'Attach a basic Energy card from your discard pile to 1 of your Mega Evolution Pokémon.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const hasEnergyInDiscard = player.discard.cards.some((c) => {
      return c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC;
    });
    if (!hasEnergyInDiscard) {
      return false;
    }

    let hasMegaPokemonInPlay = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list) => {
      if (list.cards.some((card) => card.hasTag(CardTag.MEGA))) {
        hasMegaPokemonInPlay = true;
      }
    });
    return hasMegaPokemonInPlay;
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

      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (!card.hasTag(CardTag.MEGA)) {
          blocked.push(target);
        }
      });

      return store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          player.discard,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          { allowCancel: false, min: 1, max: 1, blockedTo: blocked },
        ),
        (transfers) => {
          for (const transfer of transfers || []) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            MOVE_CARDS(store, state, player.discard, target, {
              cards: [transfer.card],
              sourceCard: this,
            });
          }
        },
      );
    }

    return state;
  }
}
