import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, EnergyCard, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Meganium extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Bayleef';
  public cardType: CardType = G;
  public hp: number = 160;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Wild Growth',
    powerType: PowerType.ABILITY,
    text: 'Each Basic [G] Energy attached to your Pokémon provides [G][G] Energy. You can\'t apply more than 1 Wild Growth Ability at a time.'
  }];

  public attacks = [{
    name: 'Solar Beam',
    cost: [G, G, C, C],
    damage: 140,
    text: '',
  }];

  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Meganium';
  public fullName: string = 'Meganium M1S';
  public regulationMark: string = 'I';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckProvidedEnergyEffect) {
      const player = effect.player;

      let hasMeganiumInPlay = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          hasMeganiumInPlay = true;
        }
      });

      if (!hasMeganiumInPlay) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      effect.source.cards.forEach(c => {
        if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC && !effect.energyMap.some(e => e.card === c)) {
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
}