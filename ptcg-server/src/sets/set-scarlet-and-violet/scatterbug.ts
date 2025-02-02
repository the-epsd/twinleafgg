import { PlayerType, PowerType, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Scatterbug extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = G;

  public hp: number = 30;

  public weakness = [{ type: R }];

  public retreat = [C];

  public powers = [{
    name: 'Adaptive Evolution',
    text: 'This Pokémon can evolve during your first turn or the turn you play it.',
    powerType: PowerType.ABILITY
  }];

  public attacks = [{
    name: 'Tackle',
    cost: [G, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'SVI';

  public name: string = 'Scatterbug';

  public fullName: string = 'Scatterbug SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '8';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.canEvolve = false;
    }

    // if (effect instanceof EvolveEffect && effect.target === this && state.turn === 2) {
    //   const player = effect.player;
    // }
    if (effect instanceof PlayPokemonEffect) {
      const player = effect.player;

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
}
