import {
  PokemonCard,
  Stage,
  CardType,
  CardTag,
  StoreLike,
  State,
  PowerType,
  StateUtils,
  GameLog,
} from '../../../game';
import { Effect, EvolveEffect, PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class TeamRocketsAmpharos extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = "Team Rocket's Flaaffy";
  protected _tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType[] = [L];
  public hp: number = 140;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [
    {
      name: 'Darkest Impulse',
      powerType: PowerType.ABILITY,
      text: "When your opponent plays a Pokémon from their hand to evolve 1 of their Pokémon during their turn, put 4 damage counters on that Pokémon. The effect of Darkest Impulse doesn't stack.",
    },
  ];

  public attacks = [
    {
      name: 'Head Bolt',
      cost: [L, C, C],
      damage: 140,
      text: '',
    },
  ];

  public set: string = 'DRI';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = "Team Rocket's Ampharos";
  public fullName: string = "Team Rocket's Ampharos DRI";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Darkest Impulse
    if (effect instanceof EvolveEffect) {
      const evolvingPlayer = effect.player;
      const abilityOwner = StateUtils.getOpponent(state, evolvingPlayer);

      if (effect.darkestImpulseSV) {
        return state;
      }

      if (!StateUtils.isPokemonInPlay(abilityOwner, this)) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, {
        name: abilityOwner.name,
        ability: this.powers[0].name,
      });

      const placeCounters = new PlaceDamageCountersEffect(
        abilityOwner,
        effect.target,
        40,
        this,
        this.powers[0],
      );
      store.reduceEffect(state, placeCounters);
      effect.darkestImpulseSV = true;
    }

    return state;
  }
}
