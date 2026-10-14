import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import {
  TrainerCard,
  StoreLike,
  State,
  DamageMap,
  GameError,
  GameMessage,
  MoveDamagePrompt,
  PlayerType,
  SlotType,
  StateUtils,
  Player,
} from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class DamagePump extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'F';
  public set: string = 'LOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '156';
  public name: string = 'Damage Pump';
  public fullName: string = 'Damage Pump LOR';
  public text: string =
    'Move up to 2 damage counters from 1 of your Pokémon to your other Pokémon in any way you like.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    let hasDamagedPokemon = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      if (cardList.damage > 0) {
        hasDamagedPokemon = true;
      }
    });

    if (!hasDamagedPokemon) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // Check if any Pokémon have damage
      let hasDamagedPokemon = false;
      const damagedPokemon: DamageMap[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.damage > 0) {
          hasDamagedPokemon = true;
          damagedPokemon.push({ target, damage: cardList.damage });
        }
      });

      if (!hasDamagedPokemon) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const maxAllowedDamage: DamageMap[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });

      effect.preventDefault = true;

      return store.prompt(
        state,
        new MoveDamagePrompt(
          effect.player.id,
          GameMessage.MOVE_DAMAGE,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          maxAllowedDamage,
          { min: 1, max: 2, allowCancel: false, blockedFrom: [], blockedTo: [] },
        ),
        (transfers) => {
          if (transfers === null) {
            MOVE_CARDS(store, state, player.hand, player.discard, {
              cards: [effect.trainerCard],
              sourceCard: this,
            });
            return state;
          }

          let totalDamageMoved = 0;
          for (const transfer of transfers) {
            const source = StateUtils.getTarget(state, player, transfer.from);
            const target = StateUtils.getTarget(state, player, transfer.to);

            const damageToMove = Math.min(20 - totalDamageMoved, Math.min(10, source.damage));
            if (damageToMove > 0) {
              source.damage -= damageToMove;
              target.damage += damageToMove;
              totalDamageMoved += damageToMove;
            }

            if (totalDamageMoved >= 20) break;
          }

          return state;
        },
      );
    }
    return state;
  }
}
