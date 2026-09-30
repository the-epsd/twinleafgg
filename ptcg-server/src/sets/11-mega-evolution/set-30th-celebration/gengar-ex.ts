import {
  PokemonCard,
  Stage,
  CardType,
  CardTag,
  PowerType,
  StoreLike,
  State,
  StateUtils,
  ChoosePokemonPrompt,
  PlayerType,
  SlotType,
  GameMessage,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { KnockOutEffect } from '../../../game/store/effects/game-effects';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';
import {
  WAS_ATTACK_USED,
  COIN_FLIP_PROMPT,
  CONFIRMATION_PROMPT,
  IS_ABILITY_BLOCKED,
} from '../../../game/store/prefabs/prefabs';

export class Gengarex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  protected _tags = [CardTag.POKEMON_ex];
  public evolvesFrom: string = 'Haunter';
  public hp: number = 280;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Fainting Spell',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is Knocked Out by damage from an attack from your opponent\'s Pokémon, flip a coin. If heads, the Attacking Pokémon is Knocked Out.'
  }];

  public attacks = [{
    name: 'Chaotic Pain',
    cost: [D, D],
    damage: 0,
    text: 'Place 13 damage counters on 1 of your opponent\'s Pokémon.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '90';
  public name: string = 'Gengar ex';
  public fullName: string = 'Gengar ex 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fainting Spell
    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, wantToUse => {
        if (wantToUse) {
          COIN_FLIP_PROMPT(store, state, player, flipResult => {
            if (flipResult) {
              opponent.active.damage += 999;
            }
          });
        }
      });
    }

    // Chaotic Pain
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          effect.player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false },
        ),
        (targets) => {
          if (!targets || targets.length === 0) {
            return;
          }
          const damageEffect = new PutCountersEffect(effect, 130);
          damageEffect.target = targets[0];
          store.reduceEffect(state, damageEffect);
        },
      );
    }

    return state;
  }
}
