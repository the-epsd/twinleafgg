import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { Card, ChoosePrizePrompt, ConfirmPrompt, GameError, GameMessage } from '../../game';

export class Gallade extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public evolvesFrom = 'Kirlia';
  public cardType: CardType = F;
  public hp: number = 130;
  public weakness = [{ type: P, value: +30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Sonic Blade',
    cost: [F, C],
    damage: 0,
    text: 'Put damage counters on the Defending Pokémon until it is 50 HP away from being Knocked Out. If you do, your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
  },
  {
    name: 'Psychic Cut',
    cost: [P, C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'You may choose as many of your face-down Prize cards as you like and put them face up. If you do, this attack does 60 damage plus 20 more damage for each Prize card you chose. (These cards remain face up for the rest of the game.)'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';
  public name: string = 'Gallade';
  public fullName: string = 'Gallade SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;

      const selectedTarget = opponent.active;
      const checkHpEffect = new CheckHpEffect(effect.player, selectedTarget);
      store.reduceEffect(state, checkHpEffect);

      const totalHp = checkHpEffect.hp;
      let damageAmount = totalHp - 50;

      // Adjust damage if the target already has damage
      const targetDamage = selectedTarget.damage;
      if (targetDamage > 0) {
        damageAmount = Math.max(0, damageAmount - targetDamage);
      }

      if (damageAmount > 0) {
        const damageEffect = new PutCountersEffect(effect, damageAmount);
        damageEffect.target = selectedTarget;
        store.reduceEffect(state, damageEffect);

        SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
      } else if (damageAmount <= 0) {
        return state;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const prizes = player.prizes.filter(p => p.isSecret);
      const cards: Card[] = [];
      prizes.forEach(p => { p.cards.forEach(c => cards.push(c)); });

      if (prizes.length > 0) {
        state = store.prompt(state, new ConfirmPrompt(
          effect.player.id,
          GameMessage.WANT_TO_USE_ABILITY,
        ), wantToUse => {
          if (wantToUse) {

            state = store.prompt(state, new ChoosePrizePrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON,
              { count: 1, allowCancel: true },
            ), chosenPrize => {
              const prizeCard = chosenPrize[0];

              if (prizeCard.faceUpPrize == true) {
                throw new GameError(GameMessage.CANNOT_USE_POWER);
              }

              if (chosenPrize === null || chosenPrize.length === 0) {
                return state;
              }

              prizeCard.faceUpPrize = true;
              prizeCard.isSecret = false;
              prizeCard.isPublic = true;
              effect.damage += 20;
            });
          }
        });
      }
    }

    return state;
  }

}