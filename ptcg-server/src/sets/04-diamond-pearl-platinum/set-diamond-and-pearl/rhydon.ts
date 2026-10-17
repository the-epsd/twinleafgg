import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DISCARD_A_STADIUM_CARD_IN_PLAY, SWITCH_ACTIVE_WITH_BENCHED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Rhydon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Rhyhorn';
  public hp: number = 90;
  public cardType: CardType[] = [F];
  public weakness = [{ type: W, value: 20 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Storm Up',
    cost: [F, C],
    damage: 30,
    damageCalculation: '+',
    text: 'If there is any Stadium card in play, this attack does 30 damage plus 20 more damage. Discard that Stadium card.'
  },
  {
    name: 'Crash Impact',
    cost: [F, F, C],
    damage: 60,
    text: 'Rhydon does 10 damage to itself. Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon, if any.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '60';
  public name: string = 'Rhydon';
  public fullName: string = 'Rhydon DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Storm Up
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (StateUtils.getStadiumCard(state) !== undefined) {
        effect.damage += 20;
        DISCARD_A_STADIUM_CARD_IN_PLAY(state);
      }
    }

    // Crash Impact
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.opponent);
    }

    return state;
  }
}
