import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { NEXT_TURN_ATTACK_BONUS } from '../../game/store/prefabs/prefabs';

export class Seismitoad extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom: string = 'Palpitoad';

  public cardType: CardType = CardType.WATER;

  public hp: number = 170;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Quaking Zone',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, attacks used by your opponent\'s Active Pokémon cost [C] more.'
  }];

  public attacks = [{
    name: 'Echoed Voice',
    cost: [CardType.WATER, CardType.WATER],
    damage: 120,
    text: 'During your next turn, this Pokémon\'s Echoed Voice attack does 100 more damage (before applying Weakness and Resistance).'
  }];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '52';

  public name: string = 'Seismitoad';

  public fullName: string = 'Seismitoad OBF';

  public readonly NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
  public readonly NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect &&
      StateUtils.getOpponent(state, effect.player).active.cards.includes(this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      try {
        const stub = new PowerEffect(opponent, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard) {
        effect.cost.push(CardType.COLORLESS);
        return state;
      }

      return state;
    }

    // Refs: set-boundaries-crossed/meloetta.ts (Echoed Voice), prefabs/prefabs.ts (NEXT_TURN_ATTACK_BONUS)
    NEXT_TURN_ATTACK_BONUS(effect, {
      attack: this.attacks[0],
      source: this,
      bonusDamage: 100,
      bonusMarker: this.NEXT_TURN_MORE_DAMAGE_MARKER,
      clearMarker: this.NEXT_TURN_MORE_DAMAGE_MARKER_2
    });
    return state;
  }
}
