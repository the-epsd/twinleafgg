import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { CoinFlipPrompt, GameMessage, PowerType } from '../../game';
import { HealEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class SeasManaphy4 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Water Absorb',
    useWhenInPlay: false,
    powerType: PowerType.POKEBODY,
    text: 'When you attach a [W] Energy card from your hand to Sea\'s Manaphy, remove all Special Conditions and 1 damage counter from Sea\'s Manaphy.'
  }];

  public attacks = [{
    name: 'Water Punch',
    cost: [C, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip a coin for each [W] Energy attached to Sea\'s Manaphy. This attack does 20 damage plus 10 more damage for each heads.'
  }];

  public set: string = 'PCGP';
  public name: string = 'Sea\'s Manaphy';
  public fullName: string = 'Sea\'s Manaphy PCGP 150';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '150';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect && effect.target.cards.includes(this)) {
      const player = effect.player;

      if (effect.target.specialConditions.length === 0) {
        return state;
      }

      if (!effect.energyCard.provides.includes(CardType.WATER)) {
        return state;
      }

      const pokemonCard = effect.target.getPokemonCard();
      if (pokemonCard !== this) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const healEffect = new HealEffect(player, effect.target, 10);
      state = store.reduceEffect(state, healEffect);

      const conditions = effect.target.specialConditions.slice();
      conditions.forEach(condition => {
        effect.target.removeSpecialCondition(condition);
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        if (em.provides.includes(CardType.WATER) || em.provides.includes(CardType.ANY)) {
          energyCount += em.provides.length;
        }
      });

      for (let i = 0; i < energyCount; i++) {
        store.prompt(state, [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
        ], result => {
          if (result) {
            effect.damage += 10;
          }
        });
      }
    }

    return state;
  }

}
