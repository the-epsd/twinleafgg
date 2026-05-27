import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils, CardTag, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { CheckTableStateEffect } from '../../game/store/effects/check-effects';

export class Luxio extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Shinx';
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Fighting Roar',
    powerType: PowerType.ABILITY,
    text: 'If your opponent\'s Active Pokémon is a Pokémon ex, this Pokémon can evolve during your first turn or the turn you play it.'
  }];

  public attacks = [{
    name: 'Static Shock',
    cost: [L, C],
    damage: 40,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'POR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';
  public name: string = 'Luxio';
  public fullName: string = 'Luxio POR';

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
