import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GamePhase, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AfterDamageEffect, ApplyWeaknessEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Aegislash extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Doublade';

  public cardType: CardType = CardType.METAL;

  public hp: number = 150;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Mysterious Shield',
      useWhenInPlay: false,
      powerType: PowerType.ABILITY,
      text: 'Prevent all damage done to this Pokémon by attacks from your opponent\'s Pokémon ex and Pokémon V.'
    }
  ];

  public attacks = [
    {
      name: 'Hard Bashing',
      cost: [CardType.METAL, CardType.COLORLESS],
      damage: 120,
      text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
    },
  ];

  public set: string = 'PAR';

  public setNumber = '134';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'G';

  public name: string = 'Aegislash';

  public fullName: string = 'Aegislash PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mysterious Shield
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

      if (sourceCard.tags.includes(CardTag.POKEMON_ex) || sourceCard.tags.includes(CardTag.POKEMON_V)) {

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

    // Hard Bashing
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const applyWeakness = new ApplyWeaknessEffect(effect, 90);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }

    return state;
  }

}
