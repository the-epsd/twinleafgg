import { GameError, GameMessage, State, StateUtils, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, COIN_FLIP_PROMPT, IS_POKEPOWER_BLOCKED, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Nosepass extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [F];
  public weakness = [{ type: W }];
  public retreat = [C];

  public powers = [{
    name: 'Magnetic Reversal',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if Nosepass is your Active Pokémon, you may flip a coin. If heads, switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch. This power can\'t be used if Nosepass is affected by a Special Condition.',
  }];

  public attacks = [{
    name: 'Sharpen',
    cost: [C],
    damage: 10,
    text: '',
  }];

  public set: string = 'DX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name: string = 'Nosepass';
  public fullName: string = 'Nosepass DX';

  public readonly MAGNETIC_REVERSAL_MARKER = 'MAGNETIC_REVERSAL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      REMOVE_MARKER(this.MAGNETIC_REVERSAL_MARKER, effect.player, this);
      return state;
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.MAGNETIC_REVERSAL_MARKER, this);

    // Magnetic Reversal
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.MAGNETIC_REVERSAL_MARKER, this);
      ABILITY_USED(player, this);

      COIN_FLIP_PROMPT(store, state, player, (result) => {
        if (result) {
          GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY(
            store,
            state,
            player,
            this.powers[0],
            this,
            { allowCancel: false },
          );
        }
      });
    }

    return state;
  }
}
