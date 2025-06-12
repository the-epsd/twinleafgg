import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE, THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS } from '../../game/store/prefabs/attack-effects';

export class Tinkatuff2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Tinkatink';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Play Rough',
    cost: [C, C],
    damage: 30,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 30 more damage.'
  },
  {
    name: 'Pulverizing Press',
    cost: [P, C, C],
    damage: 60,
    shredAttack: true,
    text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
  }];

  public regulationMark: string = 'G';
  public set: string = 'PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '104';
  public name: string = 'Tinkatuff';
  public fullName: string = 'Tinkatuff2 PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 30);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 60);
    }

    return state;
  }
}