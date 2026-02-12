import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ABILITY_USED, ADD_PARALYZED_TO_PLAYER_ACTIVE, ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, BLOCK_IF_HAS_SPECIAL_CONDITION, COIN_FLIP_PROMPT, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Venomoth extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Venonat';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Poison Moth Wind',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may flip a coin. If heads, your opponent\'s Active Pokémon is now Poisoned. If tails, your Active Pokémon is now Poisoned. This power can\'t be used if Venomoth is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Stun Spore',
    cost: [G, C],
    damage: 30,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'TM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';
  public name: string = 'Venomoth';
  public fullName: string = 'Venomoth TM';

  public readonly POISON_MOTH_WIND_MARKER = 'POISON_MOTH_WIND_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.POISON_MOTH_WIND_MARKER, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.POISON_MOTH_WIND_MARKER, this);

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      USE_ABILITY_ONCE_PER_TURN(player, this.POISON_MOTH_WIND_MARKER, this);
      ABILITY_USED(player, this);

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
        } else {
          ADD_POISON_TO_PLAYER_ACTIVE(store, state, player, this);
        }
      });
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    return state;
  }
}