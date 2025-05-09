import { Attack, CardType, GameError, GameMessage, PokemonCard, Power, PowerType, Resistance, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect, SpecialEnergyEffect } from '../../game/store/effects/game-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Dusknoir extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Dusclops';
  public cardType: CardType = P;
  public hp: number = 150;
  public weakness: Weakness[] = [{ type: D }];
  public resistance: Resistance[] = [{ type: F, value: -30 }]
  public retreat: CardType[] = [C, C];

  public attacks: Attack[] = [
    {
      name: 'Spooky Shot',
      cost: [P, C, C],
      damage: 120,
      text: ''
    }
  ];

  public power: Power[] = [
    {
      name: 'Spectral Breach',
      powerType: PowerType.ABILITY,
      text: 'All Special Energy attached to Pokémon (both yours and your opponent\'s) provide [C] Energy and have no other effect.'
    }
  ];

  public set: string = 'VIV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '71';
  public name: string = 'Dusknoir';
  public fullName: string = 'Dusknoir VIV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Negate special energy effect when it is attached to a Pokemon
    if (effect instanceof SpecialEnergyEffect) {
      // Check if this Dusknoir is in play
      const dusknoirCardList = StateUtils.findCardList(state, this);
      const dusknoirOwner = StateUtils.findOwner(state, dusknoirCardList);

      if (StateUtils.isPokemonInPlay(dusknoirOwner, this)) {
        // Handle special exceptions (e.g. Fusion Strike Energy)
        const energyOwner = StateUtils.findOwner(state, effect.attachedTo);
        if (effect.exemptFromOpponentsSpecialEnergyBlockingAbility && dusknoirOwner !== energyOwner) {
          return state;
        }

        // Return if ability is blocked
        if (IS_ABILITY_BLOCKED(store, state, dusknoirOwner, this)) {
          return state;
        }

        // Check if effect of ability is prevented
        const canApplyAbility = new EffectOfAbilityEffect(dusknoirOwner, this.powers[0], this, effect.attachedTo);
        store.reduceEffect(state, canApplyAbility);

        // Block the effect of the special energy if the effect is allowed
        if (canApplyAbility.target) {
          throw new GameError(GameMessage.CANNOT_USE_POWER);
        }
      }
    }

    // Special energies provide [C]
    if (effect instanceof CheckProvidedEnergyEffect) {
      // Check if this Dusknoir is in play
      const dusknoirCardList = StateUtils.findCardList(state, this);
      const dusknoirOwner = StateUtils.findOwner(state, dusknoirCardList);

      if (StateUtils.isPokemonInPlay(dusknoirOwner, this)) {
        // Return if ability is blocked
        if (IS_ABILITY_BLOCKED(store, state, dusknoirOwner, this)) {
          return state;
        }

        // Check if effect of ability is prevented
        const canApplyAbility = new EffectOfAbilityEffect(dusknoirOwner, this.powers[0], this, effect.source);
        store.reduceEffect(state, canApplyAbility);

        // Make special energies provide [C]
        if (canApplyAbility.target) {
          effect.specialEnergiesProvideColorless = true;
        }
      }
    }

    return state;
  }
}