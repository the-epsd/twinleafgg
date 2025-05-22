import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {
  PowerType, StoreLike, State, GameError,
  GameMessage,
  StateUtils
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ADD_MARKER, ADD_SLEEP_TO_PLAYER_ACTIVE, BLOCK_IF_ASLEEP_CONFUSED_PARALYZED, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';

export class Drowzee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Long-Distance Hypnosis',
    useWhenInPlay: true,
    powerType: PowerType.POKEMON_POWER,
    text: 'Once during your turn (before your attack), you may flip a coin. If heads, the Defending Pokémon is now Asleep; if tails, your Active Pokémon is now Asleep. The power can\'t be used if Drowzee is Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [
    {
      name: 'Nightmare',
      cost: [P, C],
      damage: 10,
      text: 'The Defending Pokémon is now Asleep.'
    }
  ];

  public set: string = 'TR';
  public name: string = 'Drowzee';
  public fullName: string = 'Drowzee TR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '54';

  public readonly HYPNOSIS_MARKER = 'HYPNOSIS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      REMOVE_MARKER(this.HYPNOSIS_MARKER, effect.player, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (HAS_MARKER(this.HYPNOSIS_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      BLOCK_IF_ASLEEP_CONFUSED_PARALYZED(player, this);

      ADD_MARKER(this.HYPNOSIS_MARKER, player, this);

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, opponent, this);
        } else {
          ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, player, this);
        }
      });

      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    return state;
  }
}
