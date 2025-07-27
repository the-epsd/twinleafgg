import { EnergyCard, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Raikou extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 120;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Lost Voltage',
    cost: [L, C],
    damage: 30,
    damageCalculation: '+',
    text: 'If you have any [L] Energy cards in the Lost Zone, this attack does 90 more damage.'
  }];

  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';
  public name: string = 'Raikou';
  public fullName: string = 'Raikou LOT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.player.lostzone.cards.some(c => c instanceof EnergyCard && c.provides.includes(CardType.LIGHTNING))) {
        effect.damage += 90;
      }
    }

    return state;
  }
}