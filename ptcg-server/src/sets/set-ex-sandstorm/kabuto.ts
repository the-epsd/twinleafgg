import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { AFTER_ATTACK, GET_PLAYER_BENCH_SLOTS, IS_POKEBODY_BLOCKED, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH } from '../../game/store/prefabs/prefabs';
import { PowerType, StoreLike, State, GamePhase } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Kabuto extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Mysterious Fossil';
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public powers = [{
    name: 'Exoskeleton',
    powerType: PowerType.POKEBODY,
    text: 'Any damage done to Kabuto by attacks is reduced by 20 (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Team Assembly',
    cost: [C],
    damage: 0,
    text: 'Search your deck for Omanyte, Kabuto, or any Basic Pokémon and put as many of them as you like onto your Bench. Shuffle your deck afterward. Treat the new Benched Pokémon as Basic Pokémon.'
  },
  {
    name: 'Pierce',
    cost: [F, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'SS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Kabuto';
  public fullName: string = 'Kabuto SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.getPokemonCard() === this && !IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
      if (state.phase === GamePhase.ATTACK) {
        effect.damage -= 20;
      }
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      const slots = GET_PLAYER_BENCH_SLOTS(effect.player);

      if (slots.length === 0) {
        return state;
      }

      const blocked: number[] = [];
      effect.player.deck.cards.forEach((card, index) => {
        if ((card instanceof PokemonCard && (card.name === 'Omanyte' || card.name === 'Kabuto') ||
          (card instanceof PokemonCard && card.stage === Stage.BASIC))) {
          return;
        } else {
          blocked.push(index);
        }
      });

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, effect.player, {}, { min: 0, max: slots.length, blocked });
    }

    return state;
  }
}

