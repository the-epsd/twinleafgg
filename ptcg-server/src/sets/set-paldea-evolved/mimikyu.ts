import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';

export class Mimikyu extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Safeguard',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to this Pokémon by attacks from your opponent\'s Pokémon ex and Pokémon V.'
  }];

  public attacks = [{
    name: 'Ghost Eye',
    cost: [CardType.PSYCHIC, CardType.COLORLESS],
    damage: 0,
    text: 'Put 7 damage counters on your opponent\'s Active Pokémon.'
  }];

  public regulationMark = 'G';

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '97';

  public name: string = 'Mimikyu';

  public fullName: string = 'Mimikyu PAL';

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

      if (sourceCard.tags.includes(CardTag.POKEMON_ex) || sourceCard.tags.includes(CardTag.POKEMON_V) || sourceCard.tags.includes(CardTag.POKEMON_VMAX) || sourceCard.tags.includes(CardTag.POKEMON_VSTAR)) {

        // Try to reduce PowerEffect, to check if something is blocking our ability
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
        effect.preventDefault = true;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const attackEffect = effect as AttackEffect;
      const damageEffect = new PutCountersEffect(attackEffect, 70);
      return store.reduceEffect(state, damageEffect);
    }

    return state;
  }





}
