import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Swoobat extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Woobat';
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Jet Woofer',
    cost: [P],
    damage: 0,
    text: 'For each [P] Energy attached to this Pokémon, discard the top card of your opponent\'s deck.'
  },
  {
    name: 'Acrobatics',
    cost: [C, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip 2 coins. This attack does 20 more damage for each heads.'
  }];

  public set: string = 'BCR';
  public setNumber: string = '71';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Swoobat';
  public fullName: string = 'Swoobat BCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const totalPsychicEnergy = checkProvidedEnergy.energyMap.reduce((sum, energy) => {
        return sum + energy.provides.filter(type => type === CardType.PSYCHIC || type === CardType.ANY).length;
      }, 0);

      MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: totalPsychicEnergy, sourceCard: this, sourceEffect: this.attacks[0] });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage += 20 * heads;
      });
    }

    return state;
  }
}