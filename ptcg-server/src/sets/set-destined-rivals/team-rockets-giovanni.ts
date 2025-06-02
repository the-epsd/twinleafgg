import { GameError, GameMessage } from '../../game';
import { CardTarget, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class TeamRocketsGiovanni extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public tags = [CardTag.TEAM_ROCKET];

  public regulationMark = 'I';

  public set: string = 'DRI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '174';

  public name: string = 'Team Rocket\'s Giovanni';

  public fullName: string = 'Team Rocket\'s Giovanni DRI';

  public text: string =
    'Switch your Active Team Rocket\'s Pokemon with 1 of your Benched Team Rocket\'s Pokemon. If you do, then switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const supporterTurn = player.supporterTurn;
      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      // Check if active Pokémon is a Team Rocket's Pokémon
      const activePokemon = player.active.getPokemonCard();
      if (!activePokemon ||
        !activePokemon.tags ||
        !activePokemon.tags.includes(CardTag.TEAM_ROCKET)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Create a blocked array for non-Team Rocket Pokémon
      const blocked: CardTarget[] = [];
      let teamRocketBenchCount = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (target.slot === SlotType.BENCH) {
          if (!card.tags || !card.tags.includes(CardTag.TEAM_ROCKET)) {
            blocked.push(target);
          } else {
            teamRocketBenchCount++;
          }
        }
      });

      if (teamRocketBenchCount === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Check if opponent has benched Pokémon
      const benchCount = opponent.bench.reduce((sum, b) => {
        return sum + (b.cards.length > 0 ? 1 : 0);
      }, 0);

      if (benchCount === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // First, have player choose which Team Rocket's Pokémon to switch to
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        {
          allowCancel: false,
          blocked: blocked
        }
      ), targets => {
        if (!targets || targets.length === 0) {
          player.supporter.moveCardTo(effect.trainerCard, player.discard);
          return state;
        }

        // Switch player's Pokémon
        player.active.clearEffects();
        player.switchPokemon(targets[0]);

        // Then have player choose which of opponent's benched Pokémon to switch to active
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ), oppTargets => {
          if (!oppTargets || oppTargets.length === 0) {
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
          }

          // Switch opponent's Pokémon
          opponent.active.clearEffects();
          opponent.switchPokemon(oppTargets[0]);

          player.supporter.moveCardTo(effect.trainerCard, player.discard);
          return state;
        });
      });
    }

    return state;
  }
}
