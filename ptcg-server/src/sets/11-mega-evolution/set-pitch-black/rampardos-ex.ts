import {
  PokemonCard,
  Stage,
  CardTag,
  CardType,
  PowerType,
  StoreLike,
  State,
  StateUtils,
  GameError,
  GameMessage,
  SuperType,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS } from '../../../game/store/prefabs/attack-effects';
import {
  WAS_POWER_USED,
  IS_ABILITY_BLOCKED,
  USE_ABILITY_ONCE_PER_TURN,
  COIN_FLIP_PROMPT,
  ABILITY_USED,
  REMOVE_MARKER_AT_END_OF_TURN,
  MOVE_CARDS,
} from '../../../game/store/prefabs/prefabs';

export class Rampardosex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Cranidos';
  protected _tags = [CardTag.POKEMON_ex];
  public cardType: CardType[] = [F];
  public hp: number = 330;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public powers = [{
    name: 'Destructive Headbutting',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: "Once during your turn, if this Pokémon is in the Active Spot, you may use this Ability. Flip a coin. If heads, discard an Energy from your opponent's Active Pokémon.",
  }];

  public attacks = [{
    name: 'Rowdy Hammer',
    cost: [F, F],
    damage: 150,
    text: "During your next turn, attacks used by this Pokémon do 150 more damage to your opponent's Active Pokémon (before applying Weakness and Resistance).",
  }];

  public regulationMark: string = 'J';
  public set: string = 'PBL';
  public setNumber: string = '45';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Rampardos ex';
  public fullName: string = 'Rampardos ex M5';

  public readonly DESTRUCTIVE_HEADBUTT_MARKER = 'RAMPARDOS_EX_DESTRUCTIVE_HEADBUTT_MARKER';

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
      ABILITY_USED(player, this);

      COIN_FLIP_PROMPT(store, state, player, (result) => {
        if (!result) {
          return;
        }
        if (!opponent.active.energies.cards.some(c => c.superType === SuperType.ENERGY)) {
          return;
        }
        if (!CAN_APPLY_ABILITY_TO_TARGET(
          store,
          state,
          player,
          this.powers[0],
          this,
          opponent.active,
        )) {
          return;
        }

        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          opponent.active,
          { superType: SuperType.ENERGY },
          { min: 1, max: 1, allowCancel: false },
        ), selected => {
          const cards = selected || [];
          if (cards.length > 0) {
            MOVE_CARDS(store, state, opponent.active, opponent.discard, {
              cards,
              sourceCard: this,
              sourceEffect: this.powers[0],
            });
          }
        });
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.DESTRUCTIVE_HEADBUTT_MARKER, this);

    // Rowdy Hammer — Ref: set-fates-collide/serperior.ts (Coil)
    NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS(effect, {
      source: this,
      bonusDamage: 150,
      setupAttack: this.attacks[0],
    });

    return state;
  }
}
