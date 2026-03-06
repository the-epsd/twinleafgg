import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MegaPyroarex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Litleo';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public hp: number = 340;
  public cardType: CardType = R;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Ferocious Bellow',
    cost: [R, C],
    damage: 80,
    text: 'During your opponent\'s next turn, the Defending Pokemon\'s attacks do 50 less damage.'
  },
  {
    name: 'Big Bang Fire',
    cost: [R, R, C],
    damage: 290,
    damageCalculation: '-' as '-',
    text: 'This attack does 10 less damage for each damage counter on this Pokemon.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '15';
  public name: string = 'Mega Pyroar ex';
  public fullName: string = 'Mega Pyroar ex M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.active.damageReductionNextTurn = 50;
    }
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const damageCounters = Math.floor(player.active.damage / 10);
      effect.damage = Math.max(0, 290 - damageCounters * 10);
    }
    return state;
  }
}
