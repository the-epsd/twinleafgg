import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { GamePhase, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { CoinFlipEffect } from '../../../game/store/effects/play-card-effects';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { IS_POKEBODY_BLOCKED, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Jumpluff extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Skiploom';
  public hp: number = 90;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +30 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Cotton Spore',
    powerType: PowerType.POKEBODY,
    text: 'Whenever Jumpluff would be damaged by your opponent\'s attack, flip a coin. If heads, prevent all damage done to Jumpluff by that attack.'
  }];

  public attacks = [{
    name: 'Cottonweed Punch',
    cost: [G, G],
    damage: 0,
    text: 'Flip 2 coins. Choose 1 of your opponent\'s Pokémon. For each heads, this attack does 30 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';
  public name: string = 'Jumpluff';
  public fullName: string = 'Jumpluff SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Cotton Spore
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)
      && effect.target.getPokemonCard() === this
      && state.phase === GamePhase.ATTACK
      && effect.damage > 0) {
      const owner = StateUtils.findOwner(state, effect.target);
      const attacker = effect.player;
      if (owner === attacker) {
        return state;
      }
      if (!StateUtils.isPokemonInPlay(owner, this)) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      const coinFlip = new CoinFlipEffect(owner);
      store.reduceEffect(state, coinFlip);
      if (coinFlip.result === true) {
        effect.preventDefault = true;
      }
      return state;
    }

    // Cottonweed Punch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(r => r).length;
        if (heads > 0) {
          THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(30 * heads, effect, store, state);
        }
      });
    }

    return state;
  }
}
