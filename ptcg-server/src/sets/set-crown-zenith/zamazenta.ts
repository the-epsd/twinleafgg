import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GamePhase, PowerType, PokemonCardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Zamazenta extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 130;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Metal Shield',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has any Energy attached, it takes 30 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Retaliate',
      cost: [CardType.METAL, CardType.METAL, CardType.COLORLESS],
      damage: 100,
      damageCalculation: '+',
      text: 'If any of your Pokémon were Knocked Out during your opponent\'s last turn, this attack does 120 more damage.'
    },
  ];

  public set: string = 'CRZ';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '97';

  public name: string = 'Zamazenta';

  public fullName: string = 'Zamazenta CRZ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(MarkerConstants.REVENGE_MARKER)) {
        effect.damage += 120;
      }

      return state;
    }


    // Reduce damage by 30
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();

      // It's not this pokemon card
      if (pokemonCard !== this) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Check attached energy 
      // Check attached energy 
      const zamazentaCardList = StateUtils.findCardList(state, this) as PokemonCardList;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, zamazentaCardList);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const hasAnyEnergy = checkProvidedEnergy.energyMap.length > 0;

      if (hasAnyEnergy) {
        effect.damage = Math.max(0, effect.damage - 30);
      }

      return state;
    }
    return state;
  }
}