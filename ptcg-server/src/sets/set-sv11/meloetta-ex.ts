import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
// Energy type constants (P, C, D, F) are assumed to be globally available as in other SV11B cards

export class Meloettaex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType = P;
  public hp: number = 200;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];
  public cardTag = [CardTag.POKEMON_EX];

  public powers = [{
    name: 'Live Debut',
    powerType: PowerType.ABILITY,
    text: 'If you go first, this Pokémon can attack on your first turn.'
  }];

  public attacks = [{
    name: 'Echoed Voice',
    cost: [P],
    damage: 30,
    text: 'During your next turn, this Pokémon\'s Echoed Voice attack does 80 more damage (before applying Weakness and Resistance).'
  }];

  public regulationMark = 'I';
  public set: string = 'SV11B';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Meloetta ex';
  public fullName: string = 'Meloetta ex SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // if (effect instanceof BeginTurnEffect && state.activePlayer === effect.player.id) {
    //   const meloetta = state.players[effect.player.id].pokemon[0];
    //   if (meloetta) {
    //     meloetta.canAttackFirst = true;
    //   }
    // }
    return state;
  }
} 