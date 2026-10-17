import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../../game/store/card/card-types';
import {
  PowerType, StoreLike, State, GameError,
  GameMessage,
  StateUtils
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { ADD_MARKER, HAS_MARKER, REMOVE_MARKER, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Hypno extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Drowzee';
  public cardType: CardType[] = [P];
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Goodnight, Babies',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may leave both Active Pokémon Asleep.'
  }];

  public attacks = [
    {
      name: 'Zen Headbutt',
      cost: [P, P],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'BKP';
  public name: string = 'Hypno';
  public fullName: string = 'Hypno BKP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';

  public readonly GOODNIGHT_MARKER = 'GOODNIGHT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      REMOVE_MARKER(this.GOODNIGHT_MARKER, effect.player, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (HAS_MARKER(this.GOODNIGHT_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      ADD_MARKER(this.GOODNIGHT_MARKER, player, this);

      APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
        store,
        state,
        player,
        this.powers[0],
        this,
        opponent.active,
        [SpecialCondition.ASLEEP],
      );
      APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
        store,
        state,
        player,
        this.powers[0],
        this,
        player.active,
        [SpecialCondition.ASLEEP],
      );

      return state;
    }

    return state;
  }
}
