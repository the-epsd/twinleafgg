import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, PlayerType, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Gardevoir extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Kirlia';
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 110;
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Psychic Mirage',
    powerType: PowerType.ABILITY,
    text: 'Each basic [P] Energy attached to your [P] Pokémon provides [P][P] Energy. You can\'t apply more than 1 [P] Mirage Ability at a time.'
  }];

  public attacks = [{
    name: 'Mind Shock',
    cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
    damage: 60,
    text: 'This attack\'s damage isn\'t affected by Weakness or Resistance. '
  }]

  public set: string = 'DEX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '109';
  public name: string = 'Gardevoir';
  public fullName: string = 'Gardevoir DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect) {
      const player = effect.player;

      let hasGardevoirInPlay = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          hasGardevoirInPlay = true;
        }
      });

      if (!hasGardevoirInPlay) {
        return state;
      }

      if (hasGardevoirInPlay) {

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

        effect.source.cards.forEach(c => {
          if (c instanceof EnergyCard && !effect.energyMap.some(e => e.card === c)) {
            const providedTypes = c.provides.filter(type => type === CardType.PSYCHIC);
            if (providedTypes.length > 0) {
              effect.energyMap.push({ card: c, provides: [CardType.PSYCHIC, CardType.PSYCHIC] });
            }
          }
        });
        return state;
      }
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      effect.ignoreWeakness = true;
      effect.ignoreResistance = true;

    }

    return state;
  }

}