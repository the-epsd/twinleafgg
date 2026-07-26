import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { reduceHideNSneak } from './hide-n-sneak';

export class Shuppet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [
    {
      name: "Hide 'n' Sneak",
      powerType: PowerType.ABILITY,
      text: "Prevent all effects of your opponent's Pokémon's attacks and Abilities done to this Pokémon. (Damage is not an effect.)",
    },
  ];

  public attacks = [
    {
      name: 'Hang Down',
      cost: [P],
      damage: 10,
      text: '',
    },
  ];

  public set: string = 'PBL';
  public setNumber: string = '33';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Shuppet';
  public fullName: string = 'Shuppet M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    reduceHideNSneak(store, state, effect, this);
    return state;
  }
}
