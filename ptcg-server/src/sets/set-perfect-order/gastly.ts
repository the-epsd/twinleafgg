import { PokemonCard, Stage, CardType, StoreLike, State } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { CoinFlipEffect } from "../../game/store/effects/play-card-effects";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Gastly extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Surprise Attack',
    cost: [D],
    damage: 30,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Gastly';
  public fullName: string = 'Gastly M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Surprise Attack - coin flip
    if (WAS_ATTACK_USED(effect, 0, this) && effect instanceof AttackEffect) {
      const player = effect.player;

      const coinFlipEffect = new CoinFlipEffect(player, (result: boolean) => {
        if (result === false) {
          // Tails - attack does nothing
          effect.damage = 0;
        }
      });

      return store.reduceEffect(state, coinFlipEffect);
    }

    return state;
  }
}
