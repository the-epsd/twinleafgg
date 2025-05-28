import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { ADD_MARKER, COIN_FLIP_PROMPT, CONFIRMATION_PROMPT, HAS_MARKER, IS_POKEPOWER_BLOCKED, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EffectOfAbilityEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class JolteonStar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.STAR];
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Yellow Ray',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Jolteon Star from your hand onto your Bench, you may put 1 damage counter on each Active Pokémon (both yours and your opponent\'s).'
  }];

  public attacks = [{
    name: 'Agility',
    cost: [L, L, C],
    damage: 40,
    text: 'Flip a coin. If heads, prevent all effects of an attack, including damage, done to Jolteon Star during your opponent\'s next turn.'
  }];

  public set: string = 'PK';
  public name: string = 'Jolteon Star';
  public fullName: string = 'Jolteon Star PK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';

  public readonly YELLOW_RAY_MARKER = 'YELLOW_RAY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          const player = effect.player;
          const opponent = StateUtils.getOpponent(state, effect.player);

          const effectOfAbility = new EffectOfAbilityEffect(effect.player, this.powers[0], this, opponent.active);
          store.reduceEffect(state, effectOfAbility);
          if (effectOfAbility.target) {
            opponent.active.damage += 10;
          }
          player.active.damage += 10;
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          this.marker.addMarker(this.YELLOW_RAY_MARKER, this);
          ADD_MARKER(this.YELLOW_RAY_MARKER, effect.opponent, this);
        }
      });
    }

    if ((effect instanceof PutDamageEffect || effect instanceof PutCountersEffect) && effect.target.getPokemonCard() === this) {
      if (this.marker.hasMarker(this.YELLOW_RAY_MARKER, this)) {
        effect.preventDefault = true;
      }
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.YELLOW_RAY_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.YELLOW_RAY_MARKER, effect.player, this);
      this.marker.removeMarker(this.YELLOW_RAY_MARKER, this);
    }

    return state;
  }

}
