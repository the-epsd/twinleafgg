import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType, StoreLike, State, StateUtils, GameError } from '../../game';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { GameMessage } from '../../game/game-message';
import { ABILITY_USED, ADD_MARKER, ADD_POISON_TO_PLAYER_ACTIVE, BLOCK_RETREAT_IF_MARKER, HAS_MARKER, REMOVE_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

export class Ariados extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Spinarak';
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Poisonous Nest',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may use this Ability. Both Active Pokémon (except for [G] Pokémon) are now Poisoned.'
  }];

  public attacks = [{
    name: 'Impound',
    cost: [G, C],
    damage: 30,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'AOR';
  public name: string = 'Ariados';
  public fullName: string = 'Ariados AOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';

  public readonly POISONOUS_NEST_MARKER = 'POISONOUS_NEST_MARKER';
  public readonly IMPOUND_MARKER: string = 'IMPOUND_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    //Ability
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (HAS_MARKER(this.POISONOUS_NEST_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      // Check if the Pokémon is Grass
      const checkPokemonTypeEffectPlayer = new CheckPokemonTypeEffect(player.active);
      store.reduceEffect(state, checkPokemonTypeEffectPlayer);
      const isGrassPokemonPlayer = checkPokemonTypeEffectPlayer.cardTypes.includes(CardType.GRASS);

      const checkPokemonTypeEffectOpponent = new CheckPokemonTypeEffect(opponent.active);
      store.reduceEffect(state, checkPokemonTypeEffectOpponent);
      const isGrassPokemonOpponent = checkPokemonTypeEffectOpponent.cardTypes.includes(CardType.GRASS);

      if (!isGrassPokemonPlayer) {
        ADD_POISON_TO_PLAYER_ACTIVE(store, state, player, this);
      }

      if (!isGrassPokemonOpponent) {
        ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
      }

      ADD_MARKER(this.POISONOUS_NEST_MARKER, player, this);
      ABILITY_USED(player, this);
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      REMOVE_MARKER(this.POISONOUS_NEST_MARKER, player, this);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_MARKER(this.IMPOUND_MARKER, opponent.active, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, this.IMPOUND_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, this.IMPOUND_MARKER, this);

    //Marker remover
    if (effect instanceof EndTurnEffect) {
      if (HAS_MARKER(this.POISONOUS_NEST_MARKER, effect.player, this)) {
        REMOVE_MARKER(this.POISONOUS_NEST_MARKER, effect.player, this);
      }
    }

    return state;
  }

}