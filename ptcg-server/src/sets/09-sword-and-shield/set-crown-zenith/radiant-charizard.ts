import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class RadiantCharizard extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.RADIANT];
  public cardType: CardType = R;
  public hp: number = 160;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Excited Heart',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon\'s attacks cost [C] less for each Prize card your opponent has taken.'
  }];

  public attacks = [{
    name: 'Combustion Blast',
    cost: [R, C, C, C, C],
    damage: 250,
    text: 'During your next turn, this Pokémon can\'t use Combustion Blast.'
  }];

  public regulationMark = 'F';
  public set: string = 'CRZ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Radiant Charizard';
  public fullName: string = 'Radiant Charizard CRZ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const index = effect.cost.indexOf(CardType.COLORLESS);

      // No cost to reduce
      if (index === -1 || IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      for (let i = 0; i < opponent.prizesTaken; i++) {
        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index !== -1) {
          effect.cost.splice(index, 1);
        }
      }
      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Combustion Blast')) {
        player.active.cannotUseAttacksNextTurnPending.push('Combustion Blast');
      }
    }
    return state;
  }
}
