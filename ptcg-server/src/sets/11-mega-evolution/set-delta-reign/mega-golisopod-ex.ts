import { CardTag, CardType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { BLOCK_RETREAT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class MegaGolisopodex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Wimpod';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = G;
  public hp: number = 340;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Finishing Blow',
    cost: [G],
    damage: 60,
    damageCalculation: '+',
    text: 'This attack does 160 more damage if your opponent\'s Active Pokémon has any damage counters on it.',
  },
  {
    name: 'Quatro Hold',
    cost: [C, C, C],
    damage: 160,
    text: 'During your opponent\'s next turn, the Defending Pokémon can\'t Retreat.',
  }];

  public regulationMark: string = 'J';
  public set: string = 'M6';
  public setNumber: string = '9';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Golisopod ex';
  public fullName: string = 'Mega Golisopod ex M6';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Finishing Blow
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.active.damage > 0) {
        effect.damage += 160;
      }
    }

    // Quatro Hold
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    return state;
  }
}
