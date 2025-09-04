import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardTag } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { GamePhase, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Bouffalantex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public cardType = C;
  public hp: number = 220;
  public weakness = [{ type: F }];
  public resistance = [];
  public retreat = [C, C];

  public powers = [{
    name: 'Bouffer',
    powerType: PowerType.ABILITY,
    text: 'This Pokemon takes 30 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Gold Breaker',
    cost: [C, C, C],
    damage: 100,
    text: 'If your opponent\'s Active Pokemon is a Pokemon ex, this attack does 100 more damage.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'WHT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '77';
  public name: string = 'Bouffalant ex';
  public fullName: string = 'Bouffalant ex SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bouffer: reduce damage taken by 30 after Weakness/Resistance
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();

      // It's not this pokemon card
      if (pokemonCard !== this) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

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

      effect.damage = Math.max(0, effect.damage - 30);
    }

    // Gold Breaker: +100 if opponent's Active is a Pokemon ex
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const oppActive = opponent.active.getPokemonCard();
      if (oppActive && oppActive.tags && oppActive.tags.includes(CardTag.POKEMON_ex)) {
        effect.damage += 100;
      }
    }
    return state;
  }
} 