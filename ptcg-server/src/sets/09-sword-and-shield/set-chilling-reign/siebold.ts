import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../../game/store/card/card-types';
import {
  StoreLike,
  State,
  GameError,
  GameMessage,
  PlayerType,
  SlotType,
  ChoosePokemonPrompt,
  PokemonCardList,
  Player,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { CardTarget } from '../../../game/store/actions/play-card-action';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Siebold extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'E';
  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '153';
  public name: string = 'Siebold';
  public fullName: string = 'Siebold CRE';
  public text: string =
    'Choose up to 2 of your Rapid Strike Pokémon and heal 60 damage from each of them. You may play only 1 Supporter card during your turn.';
  protected _tags = [CardTag.RAPID_STRIKE];

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }

    let hasRapidStrikeWithDamage = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
      if (card.hasTag(CardTag.RAPID_STRIKE) && cardList.damage > 0) {
        hasRapidStrikeWithDamage = true;
      }
    });

    if (!hasRapidStrikeWithDamage) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // Check if any Rapid Strike Pokemon has damage
      let hasRapidStrikeWithDamage = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.hasTag(CardTag.RAPID_STRIKE) && cardList.damage > 0) {
          hasRapidStrikeWithDamage = true;
        }
      });

      if (!hasRapidStrikeWithDamage) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Block non-Rapid Strike Pokemon and undamaged Pokemon
      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (!card.hasTag(CardTag.RAPID_STRIKE) || cardList.damage === 0) {
          blocked.push(target);
        }
      });

      store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_HEAL,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false, min: 1, max: 2, blocked },
        ),
        (selected) => {
          const targets: PokemonCardList[] = selected || [];
          targets.forEach((target) => {
            const healEffect = new HealEffect(player, target, 60);
            store.reduceEffect(state, healEffect);
          });
        },
      );
    }

    return state;
  }
}
