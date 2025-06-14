import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, EnergyCard, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class GalarianWeezing extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Koffing';
  public cardType: CardType = D;
  public hp: number = 130;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Energy Factory',
    powerType: PowerType.ABILITY,
    text: 'Each basic [D] Energy attached to your Pokémon that have “Weezing” in their name provides [D][D] Energy. You can\'t apply more than 1 Energy Factory Ability at a time.'
  }];

  public attacks = [
    {
      name: 'Suffocating Gas',
      cost: [D, C],
      damage: 50,
      text: '',
    }
  ];

  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';
  public name: string = 'Galarian Weezing';
  public fullName: string = 'Galarian Weezing CRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckProvidedEnergyEffect) {
      const player = effect.player;

      let hasThisInPlay = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          hasThisInPlay = true;
        }
      });

      if (!hasThisInPlay) {
        return state;
      }

      if (hasThisInPlay) {

        if (IS_ABILITY_BLOCKED(store, state, player, this)) {
          return state;
        }

        if (!effect.source.getPokemonCard()?.name.includes('Weezing')) {
          return state;
        }

        effect.source.cards.forEach(c => {
          if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC && !effect.energyMap.some(e => e.card === c)) {
            const providedTypes = c.provides.filter(type => type === CardType.DARK);
            if (providedTypes.length > 0) {
              effect.energyMap.push({ card: c, provides: [CardType.DARK, CardType.DARK] });
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