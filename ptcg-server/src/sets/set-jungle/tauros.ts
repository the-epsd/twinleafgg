import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Tauros extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Stomp',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 20,
    text: 'Flip a coin. If heads, this attack does 20 damage plus 10 more damage; if tails, this attack does 20 damage.'
  },
  {
    name: 'Rampage',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 20,
    text: 'Does 20 damage plus 10 more damage for each damage counter on Tauros. Flip a coin. If tails, Tauros is now Confused (after doing damage).'
  }];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '47';

  public name: string = 'Tauros';

  public fullName: string = 'Tauros JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result) {
          effect.damage += 10;
        } else {
          effect.damage += 20;
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      effect.damage += effect.player.active.damage;

      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        if (results) {
          player.active.addSpecialCondition(SpecialCondition.CONFUSED);
        }
      });
      return state;

    }

    return state;
  }
}