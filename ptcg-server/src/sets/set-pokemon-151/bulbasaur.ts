import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/effect-factories/prefabs';
import { HEAL_DAMAGE_FROM_THIS_POKEMON } from '../../game/store/effect-factories/prefabs';

export class Bulbasaur extends PokemonCard {

  public regulationMark = 'G';
  
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 70;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    {
      name: 'Leech Seed',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 20,
      text: 'Heal 20 damage from this Pokémon.'
    }
  ];
  public set: string = '151';
  public name: string = 'Bulbasaur';
  public fullName: string = 'Bulbasaur MEW 001';
  
  reduceEffect( store: StoreLike, state: State, effect: Effect) {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
    }
    return state;
  }
}
