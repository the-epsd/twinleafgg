import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils, PowerType } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Ampharos extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Flaaffy';
  public hp: number = 160;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Synchronized Pulse',
    powerType: PowerType.ABILITY,
    text: 'If you and your opponent have the same number of cards in your hands, this Pokemon\'s attacks do 80 more damage to your opponent\'s Active Pokemon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Flash Bolt',
    cost: [L, C],
    damage: 140,
    text: 'During your next turn, this Pokemon can\'t use Flash Bolt.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '29';
  public name: string = 'Ampharos';
  public fullName: string = 'Ampharos M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && effect.source.getPokemonCard() === this) {
      const player = StateUtils.findOwner(state, effect.source);
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (effect.target === opponent.active && player.hand.cards.length === opponent.hand.cards.length) {
        effect.damage += 80;
      }
    }
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.cannotUseAttacksNextTurnPending.push('Flash Bolt');
    }
    return state;
  }
}
