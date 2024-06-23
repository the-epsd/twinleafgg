import { EnergyCard, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckHpEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';

export class Okidogi extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'H';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 130;

  public weakness = [{ type: CardType.PSYCHIC }];

  public resistance = [ ];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [
    {
      name: 'Adrena-Power',
      useWhenInPlay: false,
      powerType: PowerType.ABILITY,
      text: 'If this Pokémon has any [D] Energy attached, it gets +100 HP, and the attacks it uses do 100 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
    }
  ];

  public attacks = [
    {
      name: 'Good Punch',
      cost: [ CardType.FIGHTING, CardType.FIGHTING ],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '111';

  public name: string = 'Okidogi';

  public fullName: string = 'Okidogi TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.player.active.getPokemonCard()! === this) {
      const player = effect.player;

      if (effect.damage === 0 || StateUtils.getOpponent(state, player).active !== effect.target) {
        return state;
      }

      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      };  

      // check for basic dark
      const basicDarkEnergy = this.cards.cards.filter(c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.name === 'Darkness Energy');

      if (basicDarkEnergy.length > 0) {
        effect.damage += 100;
        return state;
      }

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let darkProvided = false;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        if (em.provides.includes(CardType.ANY) || em.provides.includes(CardType.DARK)) {
          darkProvided = true;
        }
      });

      if (darkProvided) {
        effect.damage += 100;
      }

      const specialEnergy: EnergyCard[] = this.cards.cards.filter(c => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL)
                                                          .map(c => c as EnergyCard);
         

      if (specialEnergy.length === 0) {
        return state;
      }

      try {
        const energyEffect = new EnergyEffect(player, specialEnergy[0]);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      if (specialEnergy.some(e => e.blendedEnergies.includes(CardType.DARK))) {
        effect.damage += 100;
        return state;
      }

      return state;
    }

    if (effect instanceof CheckHpEffect && effect.target.cards.includes(this)) {
      const player = effect.player;

      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      };  

      // check for basic dark
      const basicDarkEnergy = this.cards.cards.filter(c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.name === 'Darkness Energy');

      if (basicDarkEnergy.length > 0) {
        effect.hp += 100;
        return state;
      }

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let darkProvided = false;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        if (em.provides.includes(CardType.ANY) || em.provides.includes(CardType.DARK)) {
          darkProvided = true;
        }
      });

      if (darkProvided) {
        effect.hp += 100;
      }

      const specialEnergy: EnergyCard[] = this.cards.cards.filter(c => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL)
                                                          .map(c => c as EnergyCard);
         

      if (specialEnergy.length === 0) {
        return state;
      }

      try {
        const energyEffect = new EnergyEffect(player, specialEnergy[0]);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      if (specialEnergy.some(e => e.blendedEnergies.includes(CardType.DARK))) {
        effect.hp += 100;
        return state;
      }

      return state;
    }

    return state;
  }
}