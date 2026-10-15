import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Card, ChooseEnergyPrompt, GameMessage, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DiscardCardsEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';

export class Rapidash extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Ponyta';
  public hp: number = 80;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: 20 }];
  public retreat = [];

  public attacks = [{
    name: 'Overrun',
    cost: [C, C],
    damage: 20,
    text: 'Does 10 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Blaze Up',
    cost: [R, R, C],
    damage: 50,
    text: 'Flip a coin. If tails, discard a Fire Energy attached to Rapidash and this attack does 10 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Rapidash';
  public fullName: string = 'Rapidash DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Overrun
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(10, effect, store, state);
    }

    // Blaze Up
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          return;
        }
        const benched = opponent.bench.filter(b => b.cards.length > 0);
        const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
        store.reduceEffect(state, checkProvidedEnergy);
        const hasFire = checkProvidedEnergy.energyMap.some(e =>
          e.provides.includes(CardType.FIRE)
        );
        const damageBench = () => {
          benched.forEach(target => {
            const damageEffect = new PutDamageEffect(effect, 10);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
          });
        };
        if (!hasFire) {
          damageBench();
          return;
        }
        store.prompt(state, new ChooseEnergyPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          checkProvidedEnergy.energyMap,
          [CardType.FIRE],
          { allowCancel: false },
        ), energy => {
          const cards: Card[] = (energy || []).map(e => e.card);
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);
          damageBench();
        });
      });
    }

    return state;
  }
}
