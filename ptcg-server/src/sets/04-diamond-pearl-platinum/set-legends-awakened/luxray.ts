import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON, DISCARD_ALL_ENERGY_FROM_POKEMON, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Luxray extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Luxio';
  public hp: number = 120;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F, value: +30 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Rivalry',
    powerType: PowerType.POKEBODY,
    text: 'If your opponent has any Pokémon LV.X in play, each of Luxray\'s attacks does 50 more damage to the Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Plasma',
    cost: [C, C],
    damage: 40,
    text: 'Search your discard pile for a Lightning Energy card and attach it to Luxray.'
  },
  {
    name: 'Shock Bolt',
    cost: [L, L, C],
    damage: 100,
    text: 'Discard all Lightning Energy attached to Luxray.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';
  public name: string = 'Luxray';
  public fullName: string = 'Luxray LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rivalry
    if (effect instanceof DealDamageEffect && effect.source.getPokemonCard() === this
      && effect.target === effect.opponent.active) {
      const player = effect.player;
      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }
      const opponent = StateUtils.getOpponent(state, player);
      let hasLvX = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (_list, card) => {
        if (card.hasTag(CardTag.POKEMON_LV_X)) {
          hasLvX = true;
        }
      });
      if (hasLvX) {
        effect.damage += 50;
      }
    }

    // Plasma
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON(
        store,
        state,
        effect.player,
        1,
        CardType.LIGHTNING,
        {
          destinationSlots: [SlotType.ACTIVE],
          targetFilter: (_list, card) => card === this,
          min: 0,
          allowCancel: true,
        },
      );
    }

    // Shock Bolt
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
    }

    return state;
  }
}
