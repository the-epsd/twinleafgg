import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { GameError, GameMessage, StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import {
  WAS_ATTACK_USED,
  WAS_POWER_USED,
  COIN_FLIP_PROMPT,
  IS_ABILITY_BLOCKED,
  ABILITY_USED,
  USE_ABILITY_ONCE_PER_TURN,
  REMOVE_MARKER_AT_END_OF_TURN,
  REPLACE_MARKER_AT_END_OF_TURN,
} from '../../../game/store/prefabs/prefabs';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { PokemonCard } from '../../../game/store/card/pokemon-card';

export class Rampardosex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Cranidos';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = F;
  public hp: number = 330;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public powers = [
    {
      name: 'Destructive Headbutting',
      powerType: PowerType.ABILITY,
      useWhenInPlay: true,
      text: "Once during your turn, if this Pokémon is in the Active Spot, you may use this Ability. Flip a coin. If heads, discard an Energy from your opponent's Active Pokémon.",
    },
  ];

  public attacks = [
    {
      name: 'Rowdy Hammer',
      cost: [F, F],
      damage: 150,
      text: "During your next turn, attacks used by this Pokémon do 150 more damage to your opponent's Active Pokémon (before applying Weakness and Resistance).",
    },
  ];

  public set: string = 'PBL';
  public setNumber: string = '45';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Rampardos ex';
  public fullName: string = 'Rampardos ex M5';

  public readonly DESTRUCTIVE_HEADBUTT_MARKER = 'RAMPARDOS_EX_DESTRUCTIVE_HEADBUTT_MARKER';
  public readonly RAMPAGING_HAMMER_MARKER = 'RAMPARDOS_EX_RAMPAGING_HAMMER_MARKER';
  public readonly CLEAR_RAMPAGING_HAMMER_MARKER = 'RAMPARDOS_EX_CLEAR_RAMPAGING_HAMMER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      USE_ABILITY_ONCE_PER_TURN(player, this.DESTRUCTIVE_HEADBUTT_MARKER, this);
      COIN_FLIP_PROMPT(store, state, player, (result) => {
        if (result && opponent.active.cards.length > 0) {
          const attackStub = new AttackEffect(player, opponent, this.attacks[0]);
          DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, attackStub);
        }
        ABILITY_USED(player, this);
      });
    }
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.DESTRUCTIVE_HEADBUTT_MARKER, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.marker.addMarker(this.RAMPAGING_HAMMER_MARKER, this);
    }

    // Ref: set-cosmic-eclipse/herdier.ts (Work Up)
    if (effect instanceof DealDamageEffect && effect.source) {
      const attacker = effect.player;
      const opp = StateUtils.getOpponent(state, attacker);
      if (
        (attacker.marker.hasMarker(this.RAMPAGING_HAMMER_MARKER, this) ||
          attacker.marker.hasMarker(this.CLEAR_RAMPAGING_HAMMER_MARKER, this)) &&
        effect.source.cards.includes(this) &&
        effect.source.getPokemonCard() === this &&
        effect.target === opp.active
      ) {
        effect.damage += 150;
      }
    }

    if (effect instanceof EndTurnEffect) {
      REMOVE_MARKER_AT_END_OF_TURN(effect, this.CLEAR_RAMPAGING_HAMMER_MARKER, this);
      REPLACE_MARKER_AT_END_OF_TURN(
        effect,
        this.RAMPAGING_HAMMER_MARKER,
        this.CLEAR_RAMPAGING_HAMMER_MARKER,
        this,
      );
    }

    return state;
  }
}
