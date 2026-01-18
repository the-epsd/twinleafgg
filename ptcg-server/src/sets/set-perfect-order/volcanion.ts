import { PokemonCard, Stage, CardType, StoreLike, State, EnergyCard } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { CoinFlipEffect } from "../../game/store/effects/play-card-effects";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Volcanion extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 130;
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Volcanic Strength',
    cost: [W, C],
    damage: 50,
    text: ''
  },
  {
    name: 'Powerful Steam',
    cost: [W, W, C],
    damage: 0,
    damageCalculation: 'x',
    text: 'Flip a coin for each [W] Energy attached to this Pokemon. This attack does 90 damage for each heads.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Volcanion';
  public fullName: string = 'Volcanion M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Powerful Steam - flip coin for each Water Energy
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let headsCount = 0;
      let flipsDone = 0;

      // Count Water Energy attached to this Pokemon
      const waterEnergyCount = player.active.cards.filter(card =>
        card instanceof EnergyCard && card.provides.includes(CardType.WATER)
      ).length;

      if (waterEnergyCount === 0) {
        effect.damage = 0;
        return state;
      }

      const flipCoins = (s: State): State => {
        if (flipsDone >= waterEnergyCount) {
          // All flips done, calculate damage
          effect.damage = headsCount * 90;
          return s;
        }

        const coinFlipEffect = new CoinFlipEffect(player, (result: boolean) => {
          flipsDone++;
          if (result === true) {
            headsCount++;
          }
          // Continue flipping until we've done all flips
          if (flipsDone < waterEnergyCount) {
            flipCoins(s);
          } else {
            // All flips done, calculate damage
            effect.damage = headsCount * 90;
          }
        });

        return store.reduceEffect(s, coinFlipEffect);
      };

      return flipCoins(state);
    }

    return state;
  }
}
