import { TrainerType } from '../../../game/store/card/card-types';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { ChoosePokemonPrompt } from '../../../game/store/prompts/choose-pokemon-prompt';
import {
  CardTarget,
  State,
  StoreLike,
  TrainerCard,
  GameError,
  GameMessage,
  Player,
  PlayerType,
  SlotType,
} from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class LastChancePotion extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '135';
  public name: string = 'Last Chance Potion';
  public fullName: string = 'Last Chance Potion CES';
  public text: string = 'Heal 120 damage from 1 of your Pokémon that has 30 HP or less remaining.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    // At least one of your Pokémon must have 30 HP or less remaining
    let hasValidTarget = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      const checkHpEffect = new CheckHpEffect(player, cardList);
      store.reduceEffect(state, checkHpEffect);
      if (checkHpEffect.hp - cardList.damage <= 30) {
        hasValidTarget = true;
      }
    });
    return hasValidTarget;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      const blocked: CardTarget[] = [];
      let hasPokemonWithDamage = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHpEffect);

        if (checkHpEffect.hp - cardList.damage > 30) {
          blocked.push(target);
        } else {
          hasPokemonWithDamage = true;
        }
      });

      if (!hasPokemonWithDamage) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });
      // Do not discard the card yet
      effect.preventDefault = true;

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_HEAL,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false, blocked },
        ),
        (targets) => {
          (targets || []).forEach((target) => {
            const healEffect = new HealEffect(player, target, 120);
            store.reduceEffect(state, healEffect);
          });
        },
      );
    }

    return state;
  }
}
