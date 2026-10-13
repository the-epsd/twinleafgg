import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CheckRetreatCostEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { ConfirmPrompt } from '../../../game/store/prompts/confirm-prompt';
import { GameMessage, PlayerType, PowerType, StateUtils, StoreLike, State } from '../../../game';
import { IS_ABILITY_BLOCKED, JUST_EVOLVED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Forretress extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pineco';
  public hp: number = 100;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Thorn Tempest',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon, you may put 1 damage counter on each of your opponent\'s Pokémon.'
  }];

  public attacks = [{
    name: 'Iron Crash',
    cost: [C, C],
    damage: 20,
    damageCalculation: '+',
    text: 'This attack does 20 more damage for each Colorless in your opponent\'s Active Pokémon\'s Retreat Cost.'
  }];

  public set: string = 'FLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '60';
  public name: string = 'Forretress';
  public fullName: string = 'Forretress FLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Thorn Tempest
    if (JUST_EVOLVED(effect, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, player);

      store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY
      ), result => {
        if (!result) {
          return;
        }

        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          store.reduceEffect(
            state,
            new PlaceDamageCountersEffect(player, cardList, 10, this, this.powers[0]),
          );
        });
      });
    }

    // Iron Crash
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkRetreat = new CheckRetreatCostEffect(opponent);
      state = store.reduceEffect(state, checkRetreat);

      effect.damage += 20 * checkRetreat.cost.length;
    }

    return state;
  }
}
