import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { reduceGhostVeil } from './ghost-veil';

export class Shuppet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Ghost Veil',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon can\'t be affected by effects of attacks or Abilities from your opponent\'s Pokémon.',
  }];

  public attacks = [{
    name: 'Hang Down',
    cost: [P],
    damage: 10,
    text: '',
  }];

  public set: string = 'M5';
  public setNumber: string = '31';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Shuppet';
  public fullName: string = 'Shuppet M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    reduceGhostVeil(store, state, effect, this);
    return state;
  }
}
