import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { EnergyCard, GameError, MoveEnergyPrompt, PlayerType, SlotType, StateUtils } from '../../game';

export class Poppy extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '193';

  public name: string = 'Poppy';

  public fullName: string = 'Poppy OBF';

  public text: string =
    'Move up to 2 Energy from 1 of your Pokémon to another ' +
    'of your Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      // Player has no Basic Energy in the discard pile
      let hasEnergy = false;
      let pokemonCount = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        pokemonCount += 1;
        const energyAttached = cardList.cards.some(c => {
          return c instanceof EnergyCard;
        });
        hasEnergy = hasEnergy || energyAttached;
      });

      if (!hasEnergy || pokemonCount <= 1) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;
  
      return store.prompt(state, new MoveEnergyPrompt(
        effect.player.id,
        GameMessage.MOVE_ENERGY_CARDS,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        { superType: SuperType.ENERGY },
        { min: 0, max: 2, allowCancel: false }
      ), transfers => {
        if (transfers === null) {
          return;
        }
  
        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);
          source.moveCardTo(transfer.card, target);
          player.supporter.moveCardTo(effect.trainerCard, player.discard);
          
        }
      });
    }
  
    return state;
  }

}
