import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { CoinFlipPrompt, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckHpEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Brambleghast extends PokemonCard {
  public regulationMark = 'H';
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 100;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom: string = 'Bramblin';

  public powers = [{
    name: 'Resilient Soul',
    powerType: PowerType.ABILITY,
    text: ' This Pokémon gets +50 HP for each Prize card your opponent has taken. '
  }];

  public attacks = [{
    name: 'Powerful Needles',
    cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
    damage: 80,
    damageCalculation: 'x',
    text: ' Flip a coin for each Energy attached to this Pokémon. This attack does 80 damage for each heads. '
  }];

  public set: string = 'TEF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';
  public name: string = 'Brambleghast';
  public fullName: string = 'Brambleghast TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckHpEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const prizesTaken = 6 - opponent.getPrizeLeft();

      const hpBoostPerPrize = 50;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (effect.target.getPokemonCard() === this) {
        effect.hp += prizesTaken * hpBoostPerPrize;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Check attached energy
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      const totalEnergy = checkEnergy.energyMap.reduce((sum, energy) => {
        return sum + energy.provides.length;
      }, 0);

      for (let i = 0; i < totalEnergy; i++) {
        store.prompt(state, [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
        ], result => {
          if (result === true) {
            effect.damage += 80;
          }
        });
      }
      effect.damage -= 80;
    }

    return state;
  }
}