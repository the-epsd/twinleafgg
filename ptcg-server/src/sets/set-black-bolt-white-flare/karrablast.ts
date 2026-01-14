import { PlayerType, PowerType, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Karrablast extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Stimulated Evolution',
    text: 'If you have Shelmet in play, this Pokémon can evolve during your first turn or the turn you play it.',
    powerType: PowerType.ABILITY
  }];

  public attacks = [{
    name: 'Horn Attack',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'BLK';
  public regulationMark = 'I';
  public name: string = 'Karrablast';
  public fullName: string = 'Karrablast BLK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.canEvolve = false;
    }

    if (effect instanceof PlayPokemonEffect) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (!player.bench.some(b => b.getPokemonCard()?.name === 'Shelmet') && player.active.getPokemonCard()?.name !== 'Shelmet') {
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
