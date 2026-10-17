import { CardType, Stage, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  GameError,
  GameMessage,
  Player,
  PlayerType,
  PokemonCard,
  PokemonCardList,
  SlotType,
  State,
  StoreLike,
  TrainerCard,
  pokemonHasCardType,
} from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Nanu extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '150';
  public name: string = 'Nanu';
  public fullName: string = 'Nanu TEU';
  public text: string =
    'Choose a Basic Darkness Pokémon in your discard pile. Switch it with 1 of your Pokémon in play. Any attached cards, damage counters, Special Conditions, turns in play, and any other effects remain on the new Pokémon. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    // Need a Basic Darkness Pokémon in the discard pile
    return player.discard.cards.some(
      (c) =>
        c instanceof PokemonCard && c.stage === Stage.BASIC && pokemonHasCardType(c, CardType.DARK),
    );
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      // Check if there's a Basic Darkness Pokemon in discard
      const hasBasicDarkInDiscard = player.discard.cards.some(
        (c) =>
          c instanceof PokemonCard && c.stage === Stage.BASIC && pokemonHasCardType(c, CardType.DARK),
      );

      if (!hasBasicDarkInDiscard) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });
      effect.preventDefault = true;

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
          player.discard,
          { superType: SuperType.POKEMON, stage: Stage.BASIC, cardType: [CardType.DARK] },
          { min: 1, max: 1, allowCancel: false },
        ),
        (selectedCards) => {
          const card = selectedCards[0];
          if (!card) {
            return state;
          }

          return store.prompt(
            state,
            new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON,
              PlayerType.BOTTOM_PLAYER,
              [SlotType.ACTIVE, SlotType.BENCH],
              { min: 1, max: 1, allowCancel: false },
            ),
            (targets: PokemonCardList[]) => {
              if (!targets || targets.length === 0) {
                return state;
              }

              const targetList = targets[0];

              // Move all Pokemon cards (entire evolution chain) to discard
              targetList.getPokemons().forEach((p) => {
                MOVE_CARDS(store, state, targetList, player.discard, {
                  cards: [p],
                  sourceCard: this,
                });
              });

              // Place the new Basic Darkness Pokemon into the slot
              MOVE_CARDS(store, state, player.discard, targetList, {
                cards: [card],
                sourceCard: this,
              });
            },
          );
        },
      );
    }

    return state;
  }
}
