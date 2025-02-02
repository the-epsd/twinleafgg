import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Maractus extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 110;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Zzzt',
    cost: [CardType.COLORLESS],
    damage: 20,
    text: ''
  },
  {
    name: 'Powerful Needles',
    cost: [CardType.GRASS, CardType.COLORLESS],
    damage: 60,
    text: 'Flip a coin for each Energy attached to this Pokémon. This attack does 60 damage for each heads. '
  }];

  public set: string = 'SSH';
  public regulationMark = 'D';
  public cardImage: string = 'assets/cardback.png';
  public fullName: string = 'Maractus SSH';
  public name: string = 'Maractus';
  public setNumber: string = '7';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount++;
      });

      for (let i = 0; i < energyCount; i++) {
        store.prompt(state, [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
        ], result => {
          if (result === true) {
            effect.damage += 60;
          }
        });
      }

      effect.damage -= 60;

    }

    return state;
  }
}