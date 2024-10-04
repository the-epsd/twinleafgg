import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Kartana extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 70;
  public weakness = [{ type: CardType.FIRE }];

  public attacks = [{
    name: 'Big Cut',
    cost: [CardType.GRASS],
    damage: 10,
    text: 'If you have exactly 4 Prize cards remaining, this attack does 120 more damage.'
  },
  {
    name: 'False Swipe',
    cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 0,
    text: ' Flip a coin. If heads, put damage counters on your opponent\'s Active Pokémon until its remaining HP is 10. '
  }];

  public set: string = 'UNB';
  public setNumber: string = '19';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Kartana';
  public fullName: string = 'Kartana UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.getPrizeLeft() === 4) {
        effect.damage += 120;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const checkHpEffect = new CheckHpEffect(effect.player, opponent.active);
          store.reduceEffect(state, checkHpEffect);

          const totalHp = checkHpEffect.hp;
          let damageAmount = totalHp - 10;

          // Adjust damage if the target already has damage
          const targetDamage = opponent.active.damage;
          if (targetDamage > 0) {
            damageAmount = Math.max(0, damageAmount - targetDamage);
          }

          if (damageAmount > 0) {
            const damageEffect = new PutDamageEffect(effect, damageAmount);
            damageEffect.target = opponent.active;
            store.reduceEffect(state, damageEffect);
          } else if (damageAmount <= 0) {
            const damageEffect = new PutDamageEffect(effect, 0);
            damageEffect.target = opponent.active;
            store.reduceEffect(state, damageEffect);
          }
        }
      });
    }

    return state;
  }
}