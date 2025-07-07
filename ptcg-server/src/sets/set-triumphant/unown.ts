import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { PowerType, StoreLike, State } from '../../game';
import { IS_POKEPOWER_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Unown extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'CURE',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Unown from your hand onto your Bench, remove all Special Conditions from your Active Pokémon.'
  }];

  public attacks = [{
    name: 'Hidden Power',
    cost: [P],
    damage: 10,
    text: ''
  }];

  public set: string = 'TM';
  public name: string = 'Unown';
  public fullName: string = 'Unown TM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      const conditions = player.active.specialConditions.slice();
      conditions?.forEach(condition => {
        player.active.removeSpecialCondition(condition);
      });
    }

    return state;
  }

}
