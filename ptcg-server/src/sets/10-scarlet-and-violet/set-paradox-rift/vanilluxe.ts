import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';

export class Vanilluxe extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Vanillish';
  public cardType: CardType[] = [W];
  public hp: number = 150;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public powers = [{
    name: 'Frigid Room',
    powerType: PowerType.ABILITY,
    text: 'Your opponent\'s Pokémon that have 40 HP or less remaining can\'t attack.'
  }];

  public attacks = [{
    name: 'Icicle Missile',
    cost: [W, W],
    damage: 110,
    text: ''
  }];

  public set: string = 'PAR';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Vanilluxe';
  public fullName: string = 'Vanilluxe PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Frigid Room
    if (effect instanceof AttackEffect) {
      const attackingPlayer = effect.player;
      const abilityOwner = StateUtils.getOpponent(state, attackingPlayer);

      if (!StateUtils.isPokemonInPlay(abilityOwner, this)) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      if (!CAN_APPLY_ABILITY_TO_TARGET(
        store,
        state,
        abilityOwner,
        this.powers[0],
        this,
        effect.source,
      )) {
        return state;
      }

      const checkHpEffect = new CheckHpEffect(attackingPlayer, effect.source);
      store.reduceEffect(state, checkHpEffect);

      if (checkHpEffect.hp - effect.source.damage <= 40) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    return state;
  }
}
