import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { EnergyCard } from '../../game/store/card/energy-card';
import { SlotType } from '../../game/store/actions/play-card-action';
import { ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON } from '../../game/store/prefabs/prefabs';

export class DarkPatch extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public regulationMark = 'F';

  public set: string = 'ASR';

  public name: string = 'Dark Patch';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '139';

  public fullName: string = 'Dark Patch ASR';

  public text: string =
    'Attach a basic [D] Energy card from your discard pile to 1 of your ' +
    'Benched [D] Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.DARK);
      });
      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const hasDarkPokemonOnBench = player.bench.some(bench => {
        const pokemonCard = bench.getPokemonCard();
        return pokemonCard !== undefined && pokemonCard.cardType === CardType.DARK;
      });

      if (!hasDarkPokemonOnBench) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      /*
       * Legacy pre-prefab implementation:
       * - scanned bench and built blocked CardTargets manually
       * - ran a direct AttachEnergyPrompt from discard to bench
       * - moved cards with MOVE_CARDS + StateUtils target resolution
       * - manually cleaned up trainer slot after prompt resolution
       */
      // Converted to prefab version (ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON).
      return ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON(
        store,
        state,
        player,
        1,
        CardType.DARK,
        {
          destinationSlots: [SlotType.BENCH],
          targetFilter: (_target, pokemonCard) => pokemonCard.cardType === CardType.DARK,
          energyFilter: { energyType: EnergyType.BASIC, name: 'Darkness Energy' },
          min: 1,
          allowCancel: false
        }
      );
    }

    return state;
  }

}
