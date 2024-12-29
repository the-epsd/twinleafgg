import {
  Attack,
  Card,
  EnergyCard,
  PlayerType,
  Power,
  PowerType,
  Resistance,
  State,
  StoreLike,
  Weakness
} from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class Charizard extends PokemonCard {

  public set = 'PGO';

  public setNumber = '10';

  public stage: Stage = Stage.STAGE_2;

  public cardImage: string = 'assets/cardback.png';

  public fullName = 'Charizard PGO';

  public name = 'Charizard';

  public cardType: CardType = CardType.FIRE;

  public evolvesFrom: string = 'Charmeleon';

  public hp: number = 170;

  public weakness: Weakness[] = [{ type: CardType.WATER }];

  public resistance: Resistance[] = [];

  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public regulationMark: string = 'F';

  public powers: Power[] = [
    {
      name: 'Burn Brightly',
      powerType: PowerType.ABILITY,
      useWhenInPlay: true,
      text: 'Each basic [R] Energy attached to your Pokémon provides [R][R] Energy. You can\'t apply more than 1 Burn Brightly Ability at a time.'
    }
  ];

  public attacks: Attack[] = [
    {
      name: 'Flare Blitz',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: 170,
      text: 'Discard all [R] Energy from this Pokémon.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const cards: Card[] = [];
      for (const energyMap of checkProvidedEnergy.energyMap) {
        const energy = energyMap.provides.filter(t => t === CardType.FIRE || t === CardType.ANY);
        if (energy.length > 0) {
          cards.push(energyMap.card);
        }
      }

      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);
    }

    if (effect instanceof CheckProvidedEnergyEffect) {
      const player = effect.player;
      let hasCharizardInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          hasCharizardInPlay = true;
        }
      });

      if (!hasCharizardInPlay) {
        return state;
      }

      if (hasCharizardInPlay) {

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
            const providedTypes = c.provides.filter(type => type === CardType.FIRE);
            if (providedTypes.length > 0) {
              effect.energyMap.push({ card: c, provides: [CardType.FIRE, CardType.FIRE] });
            }
          }
        });
        return state;
      }
      return state;
    }

    return state;
  }
}
