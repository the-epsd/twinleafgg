import { TrainerCard, TrainerType, CardTag, StoreLike, State, EnergyCard, EnergyType, GameError, GameMessage, CardTarget, PlayerType, AttachEnergyPrompt, SlotType, SuperType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class MegaTurbo extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'ROS';
  public name: string = 'Mega Turbo';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '86';
  public fullName: string = 'Mega Turbo ROS';

  public text: string =
    'Attach a basic Energy card from your discard pile to 1 of your Mega Evolution Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC;
      });

      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      let hasMegaPokemonInPlay = false;

      player.bench.forEach(list => {
        if (list && list.cards.some(card => card.tags.includes(CardTag.MEGA))) {
          hasMegaPokemonInPlay = true;
        }
      });

      if (!hasMegaPokemonInPlay) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const blocked2: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (!card.tags.includes(CardTag.MEGA)) {
          blocked2.push(target);
        }
      });

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: 1, max: 1, blockedTo: blocked2 }
      ), transfers => {
        transfers = transfers || [];

        if (transfers.length === 0) {
          return;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }

        player.supporter.moveCardTo(this, player.discard);
      });
    }

    return state;
  }

}
