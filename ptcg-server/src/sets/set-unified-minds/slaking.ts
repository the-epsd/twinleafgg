import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { ConfirmPrompt, GameMessage, PowerType, StoreLike, State, StateUtils, PlayerType } from '../../game';
import { DealDamageEffect, PutCountersEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, ADD_MARKER, IS_ABILITY_BLOCKED, ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT } from '../../game/store/prefabs/prefabs';

export class Slaking extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Vigoroth';
  public cardType: CardType = C;
  public hp: number = 180;
  public weakness = [{ type: F }];
  public retreat = [C, C, C, C];

  public readonly DYNAMIC_SWING_MARKER = 'SLAKING_UNM_DYNAMIC_SWING_MARKER';
  public readonly CLEAR_DYNAMIC_SWING_MARKER = 'SLAKING_UNM_CLEAR_DYNAMIC_SWING_MARKER';

  public powers = [{
    name: 'Counterattack',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is your Active Pokémon and is damaged by an opponent\'s attack (even if this Pokémon is Knocked Out), put 4 damage counters on the Attacking Pokémon.'
  }];

  public attacks = [
    {
      name: 'Dynamic Swing',
      cost: [C, C, C, C],
      damage: 100,
      damageCalculation: '+' as '+',
      text: 'You may do 100 more damage. If you do, during your opponent\'s next turn, this Pokémon takes 100 more damage from attacks (after applying Weakness and Resistance).'
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '170';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Slaking';
  public fullName: string = 'Slaking UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Counterattack (passive - damaged by opponent's attack)
    // Ref: set-unbroken-bonds/aggron.ts (Extra-Tight Press - retaliation), set-lost-thunder/shiinotic.ts (Effect Spore)
    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: this })) {
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      if (IS_ABILITY_BLOCKED(store, state, targetPlayer, this)) {
        return state;
      }

      // Check that this Pokemon is the Active Pokemon
      if (targetPlayer.active.getPokemonCard() !== this) {
        return state;
      }

      const damageEffect = new PutCountersEffect(effect, 40);
      damageEffect.target = effect.source;
      store.reduceEffect(state, damageEffect);
    }

    // Attack 1: Dynamic Swing
    // Refs: set-unbroken-bonds/vikavolt.ts (Electricannon - optional extra damage with ConfirmPrompt)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      state = store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToBoost => {
        if (wantToBoost) {
          effect.damage += 100;
          ADD_MARKER(this.DYNAMIC_SWING_MARKER, player.active, this);
          ADD_MARKER(this.CLEAR_DYNAMIC_SWING_MARKER, opponent, this);
        }
      });
    }

    // Take 100 more damage while marker is active
    if (effect instanceof DealDamageEffect
      && effect.target.marker.hasMarker(this.DYNAMIC_SWING_MARKER, this)) {
      effect.damage += 100;
    }

    // Cleanup at end of opponent's turn
    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_DYNAMIC_SWING_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_DYNAMIC_SWING_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.DYNAMIC_SWING_MARKER, this);
      });
    }

    return state;
  }
}
