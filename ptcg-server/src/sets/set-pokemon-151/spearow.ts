import { PlayerType, PowerType, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Spearow extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 50;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Evolutionary Advantage',
    powerType: PowerType.ABILITY,
    text: 'If you go second, this Pokémon can evolve during your first turn.',
  }];

  public attacks = [{
    name: 'Speed Dive',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'MEW';
  public name: string = 'Spearow';
  public fullName: string = 'Spearow MEW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckTableStateEffect) {
      const player = state.players[state.activePlayer];
      if (player.active.cards[0] == this) {
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