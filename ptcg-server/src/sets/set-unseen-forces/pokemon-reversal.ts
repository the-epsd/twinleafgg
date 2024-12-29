import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, PlayerType, SlotType, ChoosePokemonPrompt, CoinFlipPrompt, GameError } from '../../game';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class PokemonReversal extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'UF';
  public name: string = 'Pokemon Reversal';
  public fullName: string = 'Pokemon Reversal UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '88';
  public text = 'Flip a coin. If heads, choose 1 of your opponent\'s Benched Pokémon and switch it with your opponent\'s Active Pokémon.'

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const benchCount = opponent.bench.reduce((sum, b) => {
        return sum + (b.cards.length > 0 ? 1 : 0);
      }, 0);

      if (benchCount === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(state, new CoinFlipPrompt(
        player.id, GameMessage.COIN_FLIP
      ), flipResult => {
        if (flipResult) {
          store.prompt(state, new ChoosePokemonPrompt(
            opponent.id,
            GameMessage.CHOOSE_POKEMON_TO_SWITCH,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH],
            { allowCancel: false }
          ), targets => {
            if (targets && targets.length > 0) {
              opponent.active.clearEffects();
              opponent.switchPokemon(targets[0]);
              return state;
            }
          });
        }
      });

    }

    return state;
  }
}