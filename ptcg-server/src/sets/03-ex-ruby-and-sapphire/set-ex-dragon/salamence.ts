import { GameError, GameMessage, State, StateUtils, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, IS_POKEPOWER_BLOCKED, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Salamence extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Shelgon';
  public hp: number = 120;
  public cardType: CardType[] = [C];
  public weakness = [{ type: C }];
  public resistance = [{ type: R, value: -30 }, { type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Dragon Wind',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if Salamence is your Active Pokémon, you may switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch.This power can\'t be used if Salamence is affected by a Special Condition.',
  }];

  public attacks = [{
    name: 'Agility',
    cost: [C, C],
    damage: 20,
    text: 'Flip a coin. If heads, prevent all effects of an attack, including damage, done to Salamence during your opponent\'s next turn.',
  },
  {
    name: 'Dragon Claw',
    cost: [R, W, C, C],
    damage: 60,
    text: '',
  }];

  public set: string = 'DR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Salamence';
  public fullName: string = 'Salamence DR';

  public readonly DRAGON_WIND_MARKER = 'DRAGON_WIND_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      REMOVE_MARKER(this.DRAGON_WIND_MARKER, effect.player, this);
      return state;
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.DRAGON_WIND_MARKER, this);

    // Dragon Wind
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

      USE_ABILITY_ONCE_PER_TURN(player, this.DRAGON_WIND_MARKER, this);
      ABILITY_USED(player, this);

      return GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY(
        store,
        state,
        player,
        this.powers[0],
        this,
        { allowCancel: false },
      );
    }

    // Agility
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this);
    }

    return state;
  }
}
