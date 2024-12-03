import { EnergyCard, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';

export class Okidogi extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'H';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 130;

  public weakness = [{ type: CardType.PSYCHIC }];

  public resistance = [];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

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
      cost: [CardType.FIGHTING, CardType.FIGHTING],
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

    if (effect instanceof DealDamageEffect && effect.source.cards.includes(this)) {
      const player = effect.player;

      if (effect.damage === 0 || StateUtils.getOpponent(state, player).active !== effect.target) {
        return state;
      }

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, effect.source);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let darkProvided = false;

      checkProvidedEnergyEffect.energyMap.forEach(em => {
        if (em.provides.includes(CardType.DARK)) {
          darkProvided = true;
        }

        try {
          const energyEffect = new EnergyEffect(player, em.card as EnergyCard);
          store.reduceEffect(state, energyEffect);

          if ((em.card instanceof EnergyCard && em.card.blendedEnergies.includes(CardType.DARK)) ||
            (em.provides.includes(CardType.DARK) || em.provides.includes(CardType.ANY))) {
            darkProvided = true;
          }
        } catch {
          // specials blocked
        }
      });

      if (darkProvided) {
        effect.damage += 100;
        return state;
      }

      return state;
    }

    if (effect instanceof CheckHpEffect && effect.target.cards.includes(this)) {
      const player = effect.player;

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, effect.target);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let darkProvided = false;

      checkProvidedEnergyEffect.energyMap.forEach(em => {
        if (em.provides.includes(CardType.DARK)) {
          darkProvided = true;
        }

        try {
          const energyEffect = new EnergyEffect(player, em.card as EnergyCard);
          store.reduceEffect(state, energyEffect);

          if ((em.card instanceof EnergyCard && em.card.blendedEnergies.includes(CardType.DARK)) ||
            (em.provides.includes(CardType.DARK) || em.provides.includes(CardType.ANY))) {
            darkProvided = true;
          }
        } catch {
          // specials blocked
        }
      });

      if (darkProvided) {
        effect.hp += 100;
        return state;
      }

      return state;
    }

    return state;
  }
}