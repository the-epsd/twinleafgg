import { CardType, PokemonCard, Stage, PowerType, State, StateUtils, StoreLike, SelectPrompt, SpecialCondition } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { CoinFlipPrompt, GameMessage } from '../../game';
import { COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Skiploom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Hoppip';
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -30 }];
  public retreat = [];

  public powers = [{
    name: 'Buffer',
    powerType: PowerType.POKEBODY,
    text: 'If Skiploom would be Knocked Out by an opponent\'s attack, flip a coin. If heads, Skiploom is not Knocked Out and its remaining HP becomes 10 instead.'
  }];

  public attacks = [{
    name: 'Miracle Powder',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, choose 1 Special Condition. The Defending Pokémon is now affected by that Special Condition.'
  }];

  public set: string = 'TRR';
  public setNumber: string = '49';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Skiploom';
  public fullName: string = 'Skiploom TRR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Resilient Body ability
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const player = StateUtils.findOwner(state, effect.target);

      // Check if ability is blocked
      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Check if damage would cause knockout
      const checkHpEffect = new CheckHpEffect(player, effect.target);
      store.reduceEffect(state, checkHpEffect);

      if (effect.damage >= checkHpEffect.hp) {
        // Flip a coin to see if we survive
        return store.prompt(state, new CoinFlipPrompt(
          player.id,
          GameMessage.COIN_FLIP
        ), result => {
          if (result === true) {
            // If heads, prevent knockout and set HP to 10
            effect.surviveOnTenHPReason = this.powers[0].name;
          }
          return state;
        });
      }
    }

    // Somersault Dive attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          const options: { message: GameMessage, value: SpecialCondition }[] = [
            { message: GameMessage.SPECIAL_CONDITION_PARALYZED, value: SpecialCondition.PARALYZED },
            { message: GameMessage.SPECIAL_CONDITION_CONFUSED, value: SpecialCondition.CONFUSED },
            { message: GameMessage.SPECIAL_CONDITION_ASLEEP, value: SpecialCondition.ASLEEP },
            { message: GameMessage.SPECIAL_CONDITION_POISONED, value: SpecialCondition.POISONED },
            { message: GameMessage.SPECIAL_CONDITION_BURNED, value: SpecialCondition.BURNED }
          ];

          store.prompt(state, new SelectPrompt(
            player.id,
            GameMessage.CHOOSE_SPECIAL_CONDITION,
            options.map(c => c.message),
            { allowCancel: false }
          ), choice => {
            const option = options[choice];

            if (option !== undefined) {
              const specialConditionEffect = new AddSpecialConditionsEffect(effect, [option.value]);
              store.reduceEffect(state, specialConditionEffect);
            }
          });
        }
      });
    }

    return state;
  }
}