import { PlayerType, PowerType, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Bronzor extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 50;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Evolutionary Advantage',
    powerType: PowerType.ABILITY,
    text: 'If you go second, this Pokémon can evolve during your first turn.',
  }];

  public attacks = [{ name: 'Tackle', cost: [M, C], damage: 20, text: '' }];

  public set: string = 'TEU';
  public name: string = 'Bronzor';
  public fullName: string = 'Bronzor TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '100';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckTableStateEffect) {
      const player = state.players[state.activePlayer];
      if (state.turn === 2) {
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
        player.canEvolve = true;
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.pokemonPlayedTurn = state.turn - 1;
          }
        });
      }
      return state;
    }
    return state;
  }
}