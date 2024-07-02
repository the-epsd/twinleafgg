import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, EnergyCard, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Venusaur extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Ivysaur';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 160;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Jungle Totem',
    powerType: PowerType.ABILITY,
    text: 'Each basic [G] Energy attached to your Pokémon provides [G][G] Energy. You can\'t apply more than 1 Jungle Totem Ability at a time.'
  }];

  public attacks = [
    {
      name: 'Solar Beam',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 90,
      text: '',
    }
  ];

  public set: string = 'SLG';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '3';

  public name: string = 'Venusaur';

  public fullName: string = 'Venusaur SLG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckProvidedEnergyEffect) {
      const player = effect.player;

      let hasVenusaurInPlay = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          hasVenusaurInPlay = true;
        }
      });

      if (!hasVenusaurInPlay) {
        return state;
      }

      if (hasVenusaurInPlay) {

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
            const providedTypes = c.provides.filter(type => type === CardType.GRASS);
            if (providedTypes.length > 0) {
              effect.energyMap.push({ card: c, provides: [CardType.GRASS, CardType.GRASS] });
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