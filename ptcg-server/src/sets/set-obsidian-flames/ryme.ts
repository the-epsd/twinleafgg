import { ChoosePokemonPrompt, GameError, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { Stage, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { SupporterEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';


export class Ryme extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '194';

  public regulationMark = 'G';

  public name: string = 'Ryme';

  public fullName: string = 'Ryme OBF';

  public text: string =
    'Draw 3 cards. Switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      // Draw 3 cards
      player.deck.moveTo(player.hand, 3);

      // Get opponent
      const opponent = StateUtils.getOpponent(state, player);

      if (!opponent.bench.some(c => c.cards.length > 0)) {
        player.supporter.moveCardTo(effect.trainerCard, player.discard);

        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        opponent.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), results => {

        const cardList = results[0];

        if (cardList.stage == Stage.BASIC) {
          try {
            const supporterEffect = new SupporterEffect(player, effect.trainerCard);
            store.reduceEffect(state, supporterEffect);
          } catch {
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
          }
        }

        if (results.length > 0) {
          opponent.active.clearEffects();
          opponent.switchPokemon(results[0]);
        }

        player.supporter.moveCardTo(effect.trainerCard, player.discard);

        return state;
      });
    }
    return state;
  }
}

