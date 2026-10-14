import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import {
  CardTarget,
  GameError,
  GameMessage,
  PlayerType,
  SlotType,
  StoreLike,
  State,
  StateUtils,
  Player,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import { SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class ToyCatcher extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark: string = 'E';
  public set: string = 'EVS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '163';
  public name: string = 'Toy Catcher';
  public fullName: string = 'Toy Catcher EVS';
  public text: string =
    "Switch 1 of your opponent's Benched Pokémon that has 50 HP or less remaining with your opponent's Active Pokémon. You may play any number of Item cards during your turn. Attach a Pokémon Tool to 1 of your Pokémon that doesn't already have a Pokémon Tool attached.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);

    let hasValidTarget = false;
    opponent.bench.forEach((b) => {
      if (b.cards.length > 0) {
        const checkHp = new CheckHpEffect(opponent, b);
        store.reduceEffect(state, checkHp);
        const remainingHp = checkHp.hp - b.damage;
        if (remainingHp <= 50) {
          hasValidTarget = true;
        }
      }
    });

    if (!hasValidTarget) {
      return false;
    }

    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Switch 1 of your opponent's Benched Pokémon that has 50 HP or less remaining
    // with your opponent's Active Pokémon.
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if any benched Pokemon has 50 HP or less remaining
      let hasValidTarget = false;
      opponent.bench.forEach((b) => {
        if (b.cards.length > 0) {
          const checkHp = new CheckHpEffect(opponent, b);
          store.reduceEffect(state, checkHp);
          const remainingHp = checkHp.hp - b.damage;
          if (remainingHp <= 50) {
            hasValidTarget = true;
          }
        }
      });

      if (!hasValidTarget) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Build blocked array - block bench slots where remaining HP > 50 or is empty
      const blocked: CardTarget[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (target.slot !== SlotType.BENCH) {
          return;
        }
        if (cardList.cards.length === 0) {
          blocked.push(target);
          return;
        }
        const checkHp = new CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHp);
        const remainingHp = checkHp.hp - cardList.damage;
        if (remainingHp > 50) {
          blocked.push(target);
        }
      });

      return SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player, { blocked });
    }

    return state;
  }
}
