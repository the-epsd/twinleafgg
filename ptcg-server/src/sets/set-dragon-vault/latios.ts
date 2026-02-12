import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Latios extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 100;
  public weakness = [{ type: N }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Sky Blade',
      cost: [W, C],
      damage: 20,
      damageCalculation: '+' as '+',
      text: 'If Latias is on your Bench, this attack does 20 more damage.'
    },
    {
      name: 'Speed Wing',
      cost: [P, C, C],
      damage: 60,
      text: ''
    }
  ];

  public set: string = 'DRV';
  public setNumber: string = '10';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Latios';
  public fullName: string = 'Latios DRV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sky Blade - +20 if Latias on bench
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let hasLatias = false;
      player.bench.forEach(benchSlot => {
        if (benchSlot.cards.length > 0) {
          const pokemon = benchSlot.getPokemonCard();
          if (pokemon && pokemon.name === 'Latias') {
            hasLatias = true;
          }
        }
      });

      if (hasLatias) {
        effect.damage += 20;
      }
    }

    return state;
  }
}
