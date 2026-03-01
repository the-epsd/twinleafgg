import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { EnergyCard, State, StoreLike } from '../../game';
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
      text: 'The Defending Pokémon is now Asleep.'
    },
    {
      name: 'Hydro Pump',
      cost: [C, C, C],
      damage: 40,
      damageCalculation: '+',
      text: 'Does 10 more damage for each [W] Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Alomomola';
  public fullName: string = 'Alomomola BLW 39';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let waterEnergy = 0;

      player.active.cards.forEach(card => {
        if (card.superType === SuperType.ENERGY) {
          waterEnergy += (card as EnergyCard).provides.filter(e => e === CardType.WATER).length;
        }
      });

      (effect as AttackEffect).damage += 10 * waterEnergy;
    }

    return state;
  }
}
