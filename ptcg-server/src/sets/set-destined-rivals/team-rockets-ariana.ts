import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PlayerType } from '../../game/store/actions/play-card-action';

export class TeamRocketsAriana extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public tags = [CardTag.TEAM_ROCKET];

  public regulationMark = 'I';

  public set: string = 'DRI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '171';

  public name: string = 'Team Rocket\'s Ariana';

  public fullName: string = 'Team Rocket\'s Ariana DRI';

  public text: string =
    'Draw cards until you have 5 cards in your hand. If all of your Pokémon in play are Team Rocket\'s Pokemon, draw until you have 8 cards in your hand instead.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const supporterTurn = player.supporterTurn;
      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      // Check if all Pokémon in play are Team Rocket's Pokémon
      let allTeamRocket = true;
      let hasPokemon = false;

      // Check active
      if (player.active.cards.length > 0) {
        hasPokemon = true;
        const activePokemon = player.active.getPokemonCard();
        if (!activePokemon ||
          !activePokemon.tags ||
          !activePokemon.tags.includes(CardTag.TEAM_ROCKET)) {
          allTeamRocket = false;
        }
      }

      // Check bench
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (cardList !== player.active && card instanceof PokemonCard) {
          hasPokemon = true;
          if (!card.tags || !card.tags.includes(CardTag.TEAM_ROCKET)) {
            allTeamRocket = false;
          }
        }
      });

      // Set target hand size
      const targetHandSize = (hasPokemon && allTeamRocket) ? 8 : 5;

      // Draw until target hand size is reached
      while (player.hand.cards.length < targetHandSize) {
        if (player.deck.cards.length === 0) {
          break;
        }
        player.deck.moveTo(player.hand, 1);
      }

      player.supporter.moveCardTo(effect.trainerCard, player.discard);

      return state;
    }

    return state;
  }
}
