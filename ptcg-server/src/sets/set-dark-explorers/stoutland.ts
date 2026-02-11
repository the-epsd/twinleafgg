import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, ADD_MARKER, HAS_MARKER, REMOVE_MARKER } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { EnergyType } from '../../game/store/card/card-types';

export class Stoutland extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Herdier';
  public cardType: CardType = C;
  public hp: number = 130;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Special Fang',
      cost: [C, C, C],
      damage: 40,
      damageCalculation: '+',
      text: 'If this Pokémon has a Special Energy attached to it, this attack does 40 more damage.'
    },
    {
      name: 'Ferocious Bellow',
      cost: [C, C, C, C],
      damage: 60,
      text: 'During your opponent\'s next turn, any damage done by attacks from the Defending Pokémon is reduced by 30 (before applying Weakness and Resistance).'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '88';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Stoutland';
  public fullName: string = 'Stoutland DEX';

  public readonly FEROCIOUS_BELLOW_MARKER = 'FEROCIOUS_BELLOW_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Special Fang - +40 if any Special Energy attached
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkEnergy);

      const hasSpecialEnergy = checkEnergy.energyMap.some(em =>
        em.card.energyType === EnergyType.SPECIAL
      );

      if (hasSpecialEnergy) {
        effect.damage += 40;
      }
    }

    // Ferocious Bellow - add marker to defending Pokémon for damage reduction
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      ADD_MARKER(this.FEROCIOUS_BELLOW_MARKER, opponent.active, this);
    }

    // Reduce damage from Pokémon with Ferocious Bellow marker
    if (effect instanceof DealDamageEffect) {
      const source = effect.source;
      if (HAS_MARKER(this.FEROCIOUS_BELLOW_MARKER, source, this)) {
        effect.damage = Math.max(0, effect.damage - 30);
      }
    }

    // Remove marker at end of opponent's turn
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      // Remove marker from current player's Pokémon (it's now their turn ending)
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        REMOVE_MARKER(this.FEROCIOUS_BELLOW_MARKER, cardList, this);
      });
    }

    return state;
  }
}
