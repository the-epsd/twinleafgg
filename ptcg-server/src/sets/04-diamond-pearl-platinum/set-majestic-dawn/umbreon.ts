import { Player, PokemonCard, PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { CheckPokemonStatsEffect, CheckRetreatCostEffect } from '../../../game/store/effects/check-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../../game/store/prefabs/attack-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

function isEeveeEvolution(cardList: PokemonCardList): boolean {
  return cardList.getPokemons().some(p => p.evolvesFrom === 'Eevee');
}

function moonlightVeilActive(store: StoreLike, state: State, owner: Player, card: PokemonCard): boolean {
  return StateUtils.isPokemonInPlay(owner, card) && !IS_POKEBODY_BLOCKED(store, state, owner, card);
}

export class Umbreon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public hp: number = 80;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F, value: +20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Moonlight Veil',
    powerType: PowerType.POKEBODY,
    text: 'Each of your Pokémon that evolves from Eevee has no Weakness, and that Pokémon\'s Retreat Cost is 0.'
  }];

  public attacks = [{
    name: 'Confuse Ray',
    cost: [D, C, C],
    damage: 50,
    text: 'The Defending Pokémon is now Confused.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  public name: string = 'Umbreon';
  public fullName: string = 'Umbreon MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Moonlight Veil
    if (effect instanceof CheckPokemonStatsEffect) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (!isEeveeEvolution(effect.target) || !moonlightVeilActive(store, state, owner, this)) {
        return state;
      }
      effect.weakness = [];
    }

    if (effect instanceof CheckRetreatCostEffect) {
      const owner = effect.player;
      if (!isEeveeEvolution(owner.active) || !moonlightVeilActive(store, state, owner, this)) {
        return state;
      }
      effect.cost = [];
    }

    // Confuse Ray
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
    }

    return state;
  }
}
