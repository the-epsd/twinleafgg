import { CardType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, CardTarget, ChoosePokemonPrompt, PlayerType, SlotType } from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

// Pokemon without damage or without any [Y] Energy attached are blocked
function getBlockedTargets(store: StoreLike, state: State, player: Player) {
  const blocked: CardTarget[] = [];
  let hasValidTarget = false;

  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    if (cardList.damage <= 0) {
      blocked.push(target);
      return;
    }

    const checkEnergy = new CheckProvidedEnergyEffect(player, cardList);
    store.reduceEffect(state, checkEnergy);
    const hasFairyEnergy = checkEnergy.energyMap.some((em) => em.provides.includes(CardType.FAIRY));

    if (!hasFairyEnergy) {
      blocked.push(target);
      return;
    }

    hasValidTarget = true;
  });

  return { blocked, hasValidTarget };
}

export class FairyDrop extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'FCO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '99';
  public name: string = 'Fairy Drop';
  public fullName: string = 'Fairy Drop FCO';
  public text: string =
    'Heal 50 damage from 1 of your Pokémon that has any [Y] Energy attached to it.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return getBlockedTargets(store, state, player).hasValidTarget;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const { blocked, hasValidTarget } = getBlockedTargets(store, state, player);

      if (!hasValidTarget) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_HEAL,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false, blocked },
        ),
        (targets) => {
          if (targets && targets.length > 0) {
            store.reduceEffect(state, new HealEffect(player, targets[0], 50));
          }
        },
      );
    }

    return state;
  }
}
