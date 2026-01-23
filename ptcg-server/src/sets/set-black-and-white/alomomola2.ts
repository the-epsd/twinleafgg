import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';

export class Alomomola2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Water Pulse',
      cost: [W, C],
      damage: 20,
      text: 'The Defending Pokemon is now Asleep.'
    },
    {
      name: 'Hydro Pump',
      cost: [C, C, C],
      damage: 40,
      damageCalculation: '+',
      text: 'Does 10 more damage for each Water Energy attached to this Pokemon.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Alomomola';
  public fullName: string = 'Alomomola BLW 39';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let waterEnergy = 0;

      player.active.cards.forEach(card => {
        if (card instanceof EnergyCard) {
          waterEnergy += card.provides.filter(e => e === CardType.WATER).length;
        }
      });

      (effect as AttackEffect).damage += 10 * waterEnergy;
    }

    return state;
  }
}
