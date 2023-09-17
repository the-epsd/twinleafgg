import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, HEAL_DAMAGE_FROM_THIS_POKEMON } from '../../game/store/effect-factories/prefabs';

export class Ivysaur extends PokemonCard {

  public regulationMark = 'G';
  
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 100;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    {
      name: 'Leech Seed',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 30,
      text: 'Heal 20 damage from this Pokémon.'
    },
    {
      name: 'Vine Whip',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
      damage: 80,
      text: ''
    }
  ];
  public set: string = '151';
  public name: string = 'Ivysaur';
  public fullName: string = 'Ivysaur MEW 002';
  
  reduceEffect( store: StoreLike, state: State, effect: Effect) {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
    }
    return state;
  }
}