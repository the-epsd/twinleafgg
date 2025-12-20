import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';
import {HealTargetEffect} from '../../game/store/effects/attack-effects';

export class AudinoEx extends PokemonCard {
  public tags = [ CardTag.POKEMON_EX ];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 180;
  public weakness = [{ type: F }];
  public retreat = [ C, C, C ];

  public attacks = [
    {
      name: 'Drain Slap',
      cost: [ C ],
      damage: 20,
      text: 'Heal 20 damage from this Pokémon.'
    }, {
      name: 'Do the Wave',
      cost: [ C, C, C ],
      damage: 60,
      damageCalculation: '+',
      text: 'This attack does 10 more damage for each of your Benched Pokémon.'
    },
  ];

  public set: string = 'FCO';
  public name: string = 'Audino-EX';
  public fullName: string = 'Audino EX FCO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '84';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Drain Slap
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;
      
      const healTargetEffect = new HealTargetEffect(effect, 20);
      healTargetEffect.target = player.active;
      state = store.reduceEffect(state, healTargetEffect);
    }

    // Do the Wave
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      effect.damage += playerBench * 10;
    }

    return state;
  }

}
