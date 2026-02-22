import { ConfirmPrompt, GameMessage, PowerType, StateUtils } from '../..';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Machamp extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Machoke';
  public cardType: CardType = F;
  public hp: number = 150;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Crisis Muscles',
    powerType: PowerType.ABILITY,
    text: 'If your opponent has 3 or fewer Prize cards remaining, this Pokémon gets +150 HP.'
  }];

  public attacks = [{
    name: 'Strong-Arm Lariat',
    cost: [F, F],
    damage: 100,
    damageCalculation: '+',
    text: 'You may do 100 more damage. If you do, during your next turn, this Pokémon can\'t attack.'
  }];

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '88';

  public regulationMark = 'F';

  public name: string = 'Machamp';

  public fullName: string = 'Machamp LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          effect.damage += 100;
          player.active.cannotAttackNextTurnPending = true;
        }
      });
    }

    if (effect instanceof CheckHpEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (opponent.getPrizeLeft() <= 3) {
        effect.hp += 100;
      }

      return state;
    }

    return state;
  }
}