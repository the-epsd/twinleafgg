import { State, PowerType, PlayerType, CardType, PokemonCard, Stage, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Eevee extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 50;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Boosted Evolution',
    text: 'As long as this Pokémon is in the Active Spot, it can evolve during your first turn or the turn you play it.',
    powerType: PowerType.ABILITY
  }];

  public attacks = [{
    name: 'Reckless Charge',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 30,
    text: 'This Pokémon also does 10 damage to itself.'
  }];

  public regulationMark = 'H';

  public set: string = 'SSP';

  public name: string = 'Eevee';

  public fullName: string = 'Eevee SVP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '143';

  public readonly EVOLUTIONARY_ADVANTAGE_MARKER = 'EVOLUTIONARY_ADVANTAGE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.EVOLUTIONARY_ADVANTAGE_MARKER, this);
    }

    if (effect instanceof PlayPokemonEffect) {
      const player = effect.player;
      player.marker.addMarker(this.EVOLUTIONARY_ADVANTAGE_MARKER, this);
    }

    const player = state.players[state.activePlayer];

    if (state.turn >= 1 && player.active.cards[0] == this && player.marker.hasMarker(this.EVOLUTIONARY_ADVANTAGE_MARKER, this)) {

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
