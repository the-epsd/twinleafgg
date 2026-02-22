import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils, GamePhase, CardTag } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Wobbuffet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Safeguard',
    powerType: PowerType.POKEBODY,
    text: 'Prevent all effects of attacks, including damage, done to Wobbuffet by your opponent\'s Pokémon-ex.'
  }];

  public attacks = [{
    name: 'Flip Over',
    cost: [P, C, C],
    damage: 50,
    text: 'Wobbuffet does 10 damage to itself, and don\'t apply Weakness and Resistance to this damage.'
  }];

  public set: string = 'SS';
  public setNumber: string = '26';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Wobbuffet';
  public fullName: string = 'Wobbuffet SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Prevent damage from Pokemon-ex
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      // Card is not active, or damage source is unknown
      if (pokemonCard !== this || sourceCard === undefined) {
        return state;
      }

      // Do not ignore self-damage from Pokemon-ex
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.findOwner(state, effect.source);
      if (player === opponent) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      if (sourceCard.tags.includes(CardTag.POKEMON_ex)) {
        effect.preventDefault = true;
      }
    }

    // Handle Flip Over self-damage
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const target = player.active;
      if (target.cards.includes(this)) {
        const damageEffect = new PutDamageEffect(effect, 10);
        damageEffect.attackEffect.ignoreResistance = true;
        damageEffect.attackEffect.ignoreWeakness = true;
        store.reduceEffect(state, damageEffect);
      }
    }

    return state;
  }
} 