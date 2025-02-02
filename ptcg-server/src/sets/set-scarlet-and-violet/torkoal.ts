import { CoinFlipPrompt, GameMessage } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Torkoal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 130;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Stampede',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 30,
    text: ''
  }, {
    name: 'Concentrated Fire',
    cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
    damage: 80,
    damageCalculation: 'x',
    text: 'Flip a coin for each [R] Energy attached to this Pokémon. This attack does 80 damage for each heads.'
  }];

  public set: string = 'SVI';
  public name: string = 'Torkoal';
  public fullName: string = 'Torkoal SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';
  public regulationMark: string = 'G';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      // Check attached energy
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      const totalEnergy = checkEnergy.energyMap.reduce((sum, energy) => {
        return sum + energy.provides.filter(p => p === CardType.FIRE || p === CardType.ANY || p === CardType.GRW || p === CardType.GRPD).length;
      }, 0);

      effect.damage = 0;

      for (let i = 0; i < totalEnergy; i++) {
        store.prompt(state, [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
        ], result => {
          if (result === true) {
            effect.damage += 80;
          }
        });
      }
    }

    return state;
  }


}