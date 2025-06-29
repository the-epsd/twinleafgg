import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, Stage, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { COIN_FLIP_PROMPT, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND } from '../../game/store/prefabs/prefabs';
import { PokemonCard } from '../../game';

export class TeamMagmaBall extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'MA';
  public name: string = 'Team Magma Ball';
  public fullName: string = 'Team Magma Ball MA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '80';

  public text: string =
    'Flip a coin. If heads, search your deck for a Pokémon that has Team Magma in its name, show it to your opponent, and put it into your hand. If tails, search your deck for a Basic Pokémon that has Team Magma in its name, show it to your opponent and put it into your hand. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      effect.preventDefault = true;
      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Not the most efficient way to handle this, but it was being weird when I tried another way
      let blocked: number[] = [];
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          player.deck.cards.forEach((card, index) => {
            if (card instanceof PokemonCard && card.tags.includes(CardTag.TEAM_MAGMA)) {
              return;
            } else {
              blocked.push(index);
            }
          });
        } else {
          player.deck.cards.forEach((card, index) => {
            if (card instanceof PokemonCard && card.tags.includes(CardTag.TEAM_MAGMA) && card.stage === Stage.BASIC) {
              return;
            } else {
              blocked.push(index);
            }
          });
        }
      });

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, player, {}, { min: 0, max: 1, allowCancel: false, blocked });

      player.supporter.moveCardTo(this, player.discard);
    }

    return state;
  }

}
