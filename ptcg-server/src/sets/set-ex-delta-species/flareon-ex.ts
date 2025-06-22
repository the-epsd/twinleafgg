import { CardTag, CardType, GamePhase, PokemonCard, Power, PowerType, Stage, State, StateUtils, StoreLike } from '../../game';
import { AddMarkerEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ADD_BURN_TO_PLAYER_ACTIVE, ADD_CONFUSION_TO_PLAYER_ACTIVE, CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Flareonex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = R;
  public hp: number = 110;
  public weakness = [{ type: W }];
  public retreat = [C];

  public powers: Power[] = [{
    name: 'Evolutionary Flame',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you play Flareon ex from your hand to evolve 1 of your Pokémon, you may choose 1 of the Defending Pokémon. That Pokémon is now Burned and Confused.'
  }];

  public attacks = [{
    name: 'Flame Screen',
    cost: [R, C],
    damage: 30,
    text: 'During your opponent\'s next turn, any damage done to Flareon ex by attacks is reduced by 20 (after applying Weakness and Resistance).'
  },
  {
    name: 'Heat Tackle',
    cost: [R, C, C],
    damage: 70,
    text: 'Flareon ex does 10 damage to itself.'
  }];

  public set: string = 'DS';
  public setNumber: string = '108';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Flareon ex';
  public fullName: string = 'Flareon ex DS';

  public readonly FLAME_SCREEN_MARKER = 'FLAME_SCREEN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Devo Flash
    if (JUST_EVOLVED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_BURN_TO_PLAYER_ACTIVE(store, state, opponent, this);
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, opponent, this);
        }
      });
    }

    // Flame Screen
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const addMarkerEffect = new AddMarkerEffect(effect, this.FLAME_SCREEN_MARKER, this);
      return store.reduceEffect(state, addMarkerEffect);
    }

    if (effect instanceof PutDamageEffect
      && effect.source.marker.hasMarker(this.FLAME_SCREEN_MARKER, this)) {

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      effect.damage -= 20;
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.FLAME_SCREEN_MARKER, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
    }

    return state;
  }
}