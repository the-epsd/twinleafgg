import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage } from '../../../game/store/card/card-types';
import { EnergyCard, PlayerType, PowerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../../game/store/prefabs/attack-effects';

export class Sceptile extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Grovyle';
  public hp: number = 100;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +30 }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Wild Growth',
    powerType: PowerType.POKEBODY,
    text: 'Each basic Grass Energy card attached to your Grass Pokémon provides GrassGrass Energy instead. You can\'t use more than 1 Wild Growth Poké-Body each turn.'
  }];

  public attacks = [{
    name: 'Leaf Blade',
    cost: [G, G, C, C],
    damage: 50,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 50 damage plus 20 more damage.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';
  public name: string = 'Sceptile';
  public fullName: string = 'Sceptile GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Wild Growth
    if (effect instanceof CheckProvidedEnergyEffect) {
      const player = effect.player;
      let hasSceptile = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_list, card) => {
        if (card === this) {
          hasSceptile = true;
        }
      });
      if (!hasSceptile || IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const checkType = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkType);
      if (!checkType.cardTypes.includes(CardType.GRASS)) {
        return state;
      }

      effect.source.cards.forEach(c => {
        if (
          c instanceof EnergyCard &&
          c.energyType === EnergyType.BASIC &&
          c.provides.includes(CardType.GRASS) &&
          !effect.energyMap.some(e => e.card === c)
        ) {
          effect.energyMap.push({ card: c, provides: [CardType.GRASS, CardType.GRASS] });
        }
      });
    }

    // Leaf Blade
    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }

    return state;
  }
}
