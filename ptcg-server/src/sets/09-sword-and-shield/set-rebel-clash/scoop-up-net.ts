import { CardTag, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  CardTarget,
  ChoosePokemonPrompt,
  GameMessage,
  Player,
  PlayerType,
  PokemonCard,
  SlotType,
  TrainerCard,
  State,
  StoreLike,
} from '../../../game';
import { MOVE_CARD_TO, MOVE_POKEMON_OFF_BOARD } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class ScoopUpNet extends TrainerCard {
  protected _trainerType = TrainerType.ITEM;
  public set = 'RCL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber = '165';
  public name = 'Scoop Up Net';
  public fullName = 'Scoop Up Net RCL';
  public text =
    "Put 1 of your Pokémon that isn't a Pokémon V or a Pokémon-GX into your hand. (Discard all attached cards.)";
  public superType = SuperType.TRAINER;

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    let hasValidTarget = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
      if (
        card instanceof PokemonCard &&
        !card.hasTag(CardTag.POKEMON_GX) &&
        !card.hasTag(CardTag.POKEMON_V) &&
        !card.hasTag(CardTag.POKEMON_VSTAR) &&
        !card.hasTag(CardTag.POKEMON_VMAX)
      ) {
        hasValidTarget = true;
      }
    });
    return hasValidTarget;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (
          card instanceof PokemonCard &&
          (card.hasTag(CardTag.POKEMON_GX) ||
            card.hasTag(CardTag.POKEMON_V) ||
            card.hasTag(CardTag.POKEMON_VSTAR) ||
            card.hasTag(CardTag.POKEMON_VMAX))
        ) {
          blocked.push(target);
        }
      });

      MOVE_CARD_TO(state, effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false, blocked },
        ),
        (result) => {
          const cardList = result.length > 0 ? result[0] : null;
          if (cardList !== null) {
            MOVE_POKEMON_OFF_BOARD(store, state, cardList, {
              pokemonDestination: player.hand,
              attachedDestination: player.discard,
              sourceCard: this,
            });
          }
        },
      );
    }

    return state;
  }
}
