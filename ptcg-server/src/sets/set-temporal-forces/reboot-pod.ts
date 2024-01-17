import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, EnergyType, SuperType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { EnergyCard } from '../../game/store/card/energy-card';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { CardTarget, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ChoosePokemonPrompt } from '../..';

export class RebootPod extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public tags = [ CardTag.ACE_SPEC, CardTag.FUTURE ];

  public regulationMark = 'H';

  public set: string = 'SV5M';

  public name: string = 'Reboot Pod';

  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '63';

  public fullName: string = 'Reboot Pod SV5M';

  public text: string =
    'Attach a Basic Energy card from your discard pile to each of your Future Pokémon in play.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      let hasEnergyInDiscard: number = 0;
      const blocked: number[] = [];
      player.discard.cards.forEach((c, index) => {
        const isBasicEnergy = c instanceof EnergyCard && c.energyType === EnergyType.BASIC;
        if (isBasicEnergy) {
          hasEnergyInDiscard += 1;
        } else {
          blocked.push(index);
        }

        // Player does not have correct cards in discard
        if (hasEnergyInDiscard === 0) {
          throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
        }
      });

      const blocked2: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (!card.tags.includes(CardTag.FUTURE)) {
          blocked2.push(target);
        }
      });

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { min: 1, max: blocked2.length, blocked: blocked2, allowCancel: false }
      ), chosen => {

        chosen.forEach(target => {

          state = store.prompt(state, new AttachEnergyPrompt(
            player.id,
            GameMessage.ATTACH_ENERGY_TO_ACTIVE,
            player.discard,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH, SlotType.ACTIVE],
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
            { allowCancel: false, min: 0, max: 1 }
          ), transfers => {
            transfers = transfers || [];

            if (transfers.length === 0) {
              return;
            }

            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              player.deck.moveCardTo(transfer.card, target);

              player.supporter.moveCardTo(this, player.discard);

            }
          });
        });
      });
    }
    return state;
  }
}