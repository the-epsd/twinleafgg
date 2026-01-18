import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils, CardTag, PlayerType } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { PowerEffect } from "../../game/store/effects/game-effects";
import { CheckTableStateEffect } from "../../game/store/effects/check-effects";

export class Luxio extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Shinx';
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Roar of the Tiger',
    powerType: PowerType.ABILITY,
    text: 'If your opponent\'s Active Pokemon is a Pokemon ex, you can evolve this Pokemon on your first turn, or on the first turn this Pokemon is put into play.'
  }];

  public attacks = [{
    name: 'Zzzap',
    cost: [L, C],
    damage: 40,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';
  public name: string = 'Luxio';
  public fullName: string = 'Luxio M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Roar of the Tiger - can evolve on first turn if opponent's Active is ex
    if (effect instanceof CheckTableStateEffect) {
      const player = state.players[state.activePlayer];
      if (player.active.cards[0] == this) {
        const opponent = StateUtils.getOpponent(state, player);
        const opponentActive = opponent.active.getPokemonCard();

        if (opponentActive && opponentActive.tags.includes(CardTag.POKEMON_ex)) {
          try {
            const stub = new PowerEffect(player, {
              name: 'test',
              powerType: PowerType.ABILITY,
              text: ''
            }, this);
            store.reduceEffect(state, stub);
          } catch {
            return state;
          }

          // Allow evolution on first turn or first turn this Pokemon is put into play
          if (state.turn === 1 || state.turn === 2) {
            player.canEvolve = true;
            player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
              if (cardList.getPokemonCard() === this || cardList.cards.some(c => c.name === 'Shinx')) {
                cardList.pokemonPlayedTurn = state.turn - 1;
              }
            });
          }
        }
      }
      return state;
    }

    return state;
  }
}
