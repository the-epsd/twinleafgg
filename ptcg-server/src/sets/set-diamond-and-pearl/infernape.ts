import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { CoinFlipPrompt, GameMessage } from '../../game';

export class Infernape extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Monferno';
  public cardType: CardType = R;
  public hp: number = 100;
  public weakness = [{ type: W, value: +30 }];
  public retreat = [];

  public attacks = [{
    name: 'Meteor Punch',
    cost: [C],
    damage: 30,
    damageCalculation: 'x',
    text: 'Flip a coin until you get tails. This attack does 30 damage times the number of heads.'
  },
  {
    name: 'Flare Blitz',
    cost: [R, R],
    damage: 90,
    text: 'Discard all [R] Energy attached to Infernape.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Infernape';
  public fullName: string = 'Infernape DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const flipCoin = (heads: number = 0): State => {
        return store.prompt(state, [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
        ], result => {
          if (result === true) {
            return flipCoin(heads + 1);
          }
          effect.damage = 30 * heads;
          return state;
        });
      };
      return flipCoin();
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergy);

      checkProvidedEnergy.energyMap.forEach(em => {
        if (em.provides.includes(CardType.FIRE) || em.provides.includes(CardType.ANY)) {
          MOVE_CARDS(store, state, player.active, player.discard, { cards: [em.card] });
        }
      });
    }

    return state;
  }
}