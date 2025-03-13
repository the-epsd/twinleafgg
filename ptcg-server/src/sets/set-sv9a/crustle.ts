import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import {WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';
import {PowerType, StateUtils} from '../../game';
import {AfterDamageEffect, ApplyWeaknessEffect, DealDamageEffect, PutDamageEffect} from '../../game/store/effects/attack-effects';
import {PowerEffect} from '../../game/store/effects/game-effects';

export class Crustle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Dwebble';
  public cardType: CardType = G;
  public hp: number = 150;
  public weakness = [{ type: R }];
  public retreat = [ C, C, C ];

  public powers = [
    {
      name: 'Mysterious Stone House',
      useWhenInPlay: false,
      powerType: PowerType.ABILITY,
      text: 'Prevent all damage done to this Pokémon by attacks from your opponent\'s Pokémon ex.'
    }
  ];

  public attacks = [{
    name: 'Great Scissors',
    cost: [ G, C, C ],
    damage: 120,
    text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
  }];

  public set: string = 'SV9a';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';
  public name: string = 'Crustle';
  public fullName: string = 'Crustle SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mysterious Stone House
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

      if (sourceCard.tags.includes(CardTag.POKEMON_ex)) {

        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const powerEffect = new PowerEffect(player, this.powers[0], this);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }

        effect.preventDefault = true;
      }
    }

    // Great Scissors
    if (WAS_ATTACK_USED(effect, 0, this)){
      //const player = effect.player;
      //const opponent = StateUtils.getOpponent(state, player);

      effect.damage = 0;

      const dealDamage = new DealDamageEffect(effect, 120);
      store.reduceEffect(state, dealDamage);

      const applyWeakness = new ApplyWeaknessEffect(effect, dealDamage.damage);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      if (damage > 0) {
        //opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }

    return state;
  }

}
