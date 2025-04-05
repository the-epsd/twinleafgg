import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { Attack, Power, PowerType, StateUtils } from '../../game';
import { AfterDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class LatiasEX extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_EX];
  public cardType: CardType = N;
  public hp: number = 160;
  public weakness = [{ type: N }];
  public retreat = [C, C, C];

  public powers: Power[] = [{
    name: 'Bright Down',
    powerType: PowerType.ABILITY,
    text: 'Prevent all effects of attacks, including damage, done to this Pokémon by your opponent\'s Pokémon with Abilities.'
  }];

  public attacks: Attack[] = [
    {
      name: 'Barrier Break',
      cost: [R, P, C],
      damage: 70,
      shredAttack: true,
      text: 'This attack\'s damage isn\'t affected by Weakness, Resistance, or any other effects on the Defending Pokémon.'
    }
  ];

  public set: string = 'PLF';
  public name: string = 'Latias EX';
  public fullName: string = 'Latias EX PLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      // Card is not active, or damage source is unknown
      if (pokemonCard !== this || sourceCard === undefined)
        return state;

      // Do not ignore self-damage from Pokemon-Ex
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.findOwner(state, effect.source);
      if (player === opponent || state.phase !== GamePhase.ATTACK)
        return state;

      if (sourceCard.powers.length > 0
        && !IS_ABILITY_BLOCKED(store, state, opponent, sourceCard)
        && !IS_ABILITY_BLOCKED(store, state, player, this)
      )
        effect.preventDefault = true;
    }


    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.damage > 0) {
        opponent.active.damage += effect.damage;
        const afterDamage = new AfterDamageEffect(effect, effect.damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }

    return state;
  }

}
