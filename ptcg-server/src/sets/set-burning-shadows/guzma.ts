import { GameError, PokemonCardList } from '../../game';
import { GameLog, GameMessage } from '../../game/game-message';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { Stage, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { SupporterEffect, TrainerEffect, TrainerTargetEffect } from '../../game/store/effects/play-card-effects';
import { CLEAN_UP_SUPPORTER } from '../../game/store/prefabs/prefabs';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  // Don't allow to play both Guzmas when opponen has an empty bench
  const benchCount = opponent.bench.reduce((sum, b) => {
    return sum + (b.cards.length > 0 ? 1 : 0);
  }, 0);

  //let playTwoCards = false;

  if (benchCount > 0) {

    try {
      const supporterEffect = new SupporterEffect(player, effect.trainerCard);
      store.reduceEffect(state, supporterEffect);
    } catch {
      CLEAN_UP_SUPPORTER(effect, player);
      return state;
    }

    // playTwoCards = true;

    return store.prompt(state, new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_SWITCH,
      PlayerType.TOP_PLAYER,
      [SlotType.BENCH],
      { allowCancel: false }
    ), targets => {
      if (!targets || targets.length === 0) {
        return;
      }

      const targetCard = new TrainerTargetEffect(player, effect.trainerCard, targets[0]);
      targetCard.target = targets[0];
      store.reduceEffect(state, targetCard);
      if (targetCard.target) {
        opponent.switchPokemon(targetCard.target);
      } else {
        // If no target, effect ends
        CLEAN_UP_SUPPORTER(effect, player);
        return state;
      }

      store.log(state, GameLog.LOG_PLAYER_SWITCHES_POKEMON_TO_ACTIVE, { name: player.name, card: targets[0].getPokemonCard()!.name });

      next();

      // Do not discard the card yet
      effect.preventDefault = true;

      const playerHasBench = player.bench.some(b => b.cards.length > 0);

      if (!playerHasBench) {
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
      }

      let target: PokemonCardList[] = [];
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), results => {
        target = results || [];
        next();

        if (target.length === 0) {
          return state;
        }

        const cardList = results[0];

        if (cardList.isStage(Stage.BASIC)) {
          try {
            const supporterEffect = new SupporterEffect(player, effect.trainerCard);
            store.reduceEffect(state, supporterEffect);
          } catch {
            CLEAN_UP_SUPPORTER(effect, player);
            return state;
          }
        }

        player.active.clearEffects();
        player.switchPokemon(target[0]);

        store.log(state, GameLog.LOG_PLAYER_SWITCHES_POKEMON_TO_ACTIVE, { name: player.name, card: target[0].getPokemonCard()!.name });

        CLEAN_UP_SUPPORTER(effect, player);
        return state;
      });
    });
  }
}

export class Guzma extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '115';

  public set: string = 'BUS';

  public name: string = 'Guzma';

  public fullName: string = 'Guzma BUS';

  public text: string =
    'Switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon. If you do, switch your Active Pokémon with 1 of your Benched Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
