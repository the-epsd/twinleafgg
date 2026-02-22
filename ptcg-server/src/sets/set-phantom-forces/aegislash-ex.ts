import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { EnergyCard } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class AegislashEX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_EX];
  public cardType: CardType = M;
  public hp: number = 170;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Mighty Shield',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to this Pokémon by attacks from each of your opponent\'s Pokémon that has Special Energy attached to it.'
  }];

  public attacks = [{
    name: 'Slash Blast',
    cost: [C, C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'This attack does 20 more damage for each [M] Energy attached to this Pokémon.'
  }];

  public set: string = 'PHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '65';
  public name: string = 'Aegislash-EX';
  public fullName: string = 'Aegislash-EX PHF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.METAL || cardType === CardType.ANY;
        }).length;
      });
      effect.damage += energyCount * 20;
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && state.phase === GamePhase.ATTACK) {
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.getOpponent(state, effect.player);
      const opponentPokemon = opponent.active;

      const checkEnergy = new CheckProvidedEnergyEffect(opponent, opponentPokemon);
      store.reduceEffect(state, checkEnergy);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      checkEnergy.energyMap.forEach(em => {
        const energyCard = em.card;
        if (energyCard.superType === SuperType.ENERGY &&
          (energyCard as EnergyCard).energyType === EnergyType.SPECIAL) {

          if (effect instanceof PutDamageEffect
            && opponent.active.cards.includes(energyCard)) {
            effect.damage = 0;
            return state;
          }
        }
      });
    }
    return state;
  }

}
