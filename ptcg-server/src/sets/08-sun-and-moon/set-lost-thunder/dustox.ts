import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { ConfirmPrompt } from '../../../game/store/prompts/confirm-prompt';
import { GameMessage, PowerType, StateUtils, StoreLike, State } from '../../../game';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED, JUST_EVOLVED } from '../../../game/store/prefabs/prefabs';

export class Dustox extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Cascoon';
  public hp: number = 140;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Hazardous Evolution',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pok\u00e9mon from your hand to evolve 1 of your Pok\u00e9mon during your turn, you may leave your opponent\'s Active Pok\u00e9mon Paralyzed and Poisoned. If you do, put 3 damage counters instead of 1 on that Pok\u00e9mon between turns.'
  }];

  public attacks = [{
    name: 'Gust',
    cost: [G, C],
    damage: 70,
    text: ''
  }];

  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Dustox';
  public fullName: string = 'Dustox LOT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hazardous Evolution
    if (JUST_EVOLVED(effect, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY
      ), wantToUse => {
        if (wantToUse) {
          const opponent = StateUtils.getOpponent(state, player);
          APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
            store,
            state,
            player,
            this.powers[0],
            this,
            opponent.active,
            [SpecialCondition.PARALYZED, SpecialCondition.POISONED],
            30,
          );
        }
      });
    }

    return state;
  }
}
