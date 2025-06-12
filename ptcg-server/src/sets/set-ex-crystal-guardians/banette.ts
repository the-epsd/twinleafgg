import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../game/store/prefabs/attack-effects';

export class Banette extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Shuppet';
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Safeguard',
    powerType: PowerType.POKEBODY,
    text: 'Prevent all effects of attacks, including damage, done to Banette by your opponent\'s Pokémon-ex.'
  }];

  public attacks = [{
    name: 'Night Murmurs',
    cost: [P, C],
    damage: 30,
    text: 'If the Defending Pokémon is a Basic Pokémon, that Pokémon is now Confused.'
  }];

  public set: string = 'CG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Banette';
  public fullName: string = 'Banette CG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Prevent damage from Pokemon-ex
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      // Card is not active, or damage source is unknown
      if (pokemonCard !== this || sourceCard === undefined) {
        return state;
      }

      // Do not ignore self-damage from Pokemon-Ex
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.findOwner(state, effect.source);
      if (player === opponent) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (sourceCard.tags.includes(CardTag.POKEMON_ex)) {
        effect.preventDefault = true;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.opponent.active.getPokemonCard()?.stage === Stage.BASIC) {
        YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
      }
    }

    return state;
  }

}
