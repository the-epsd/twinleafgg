import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Medicham extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Meditite';
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Meditate',
    cost: [F, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Does 20 damage plus 10 more damage for each damage counter on the Defending Pokémon.'
  },
  {
    name: 'Chakra Points',
    cost: [F, C, C],
    damage: 10,
    damageCalculation: '+',
    text: 'Does 10 damage plus 10 more damage for each card in your opponent\'s hand.'
  }];

  public set: string = 'HL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Medicham';
  public fullName: string = 'Medicham HL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.damage += effect.target.damage;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.damage += effect.opponent.hand.cards.length * 10;
    }

    return state;
  }
}
