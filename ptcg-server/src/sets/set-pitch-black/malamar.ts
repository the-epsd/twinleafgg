import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../game/store/prefabs/attack-effects';

export class Malamar extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Inkay';
  public cardType: CardType = D;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Perplex',
      cost: [D],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Confused.',
    },
    {
      name: 'Brain Crush',
      cost: [D, D],
      damage: 130,
      text: 'If your opponent\'s Active Pokémon isn\'t Confused, this attack does nothing.',
    },
  ];

  public set: string = 'M5';
  public setNumber: string = '50';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Malamar';
  public fullName: string = 'Malamar M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Perplex
    // Ref: set-lost-origin/magearna.ts (Windup Beam - YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
    }

    // Brain Crush
    // Ref: set-dragons-majesty/heatmor.ts (Charring Breath)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (!effect.opponent.active.specialConditions.includes(SpecialCondition.CONFUSED)) {
        effect.damage = 0;
      }
    }

    return state;
  }
}
