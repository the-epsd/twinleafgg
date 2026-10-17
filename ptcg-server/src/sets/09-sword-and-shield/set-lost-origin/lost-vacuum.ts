import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  TrainerCard,
  StoreLike,
  State,
  Card,
  CardList,
  CardTarget,
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  GameError,
  GameMessage,
  PlayerType,
  PokemonCardList,
  SelectOptionPrompt,
  SlotType,
  StateUtils,
  Player,
} from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class LostVacuum extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'F';
  public set: string = 'LOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '162';
  public name: string = 'Lost Vacuum';
  public fullName: string = 'Lost Vacuum LOR';
  public text: string = `You can use this card only if you put another card from your hand in the Lost Zone.

Choose a Pokémon Tool attached to any Pokémon, or any Stadium in play, and put it in the Lost Zone.`;

  public canPlay(_store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);

    let pokemonsWithTool = 0;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      if (cardList.tools.length > 0) {
        pokemonsWithTool += 1;
      }
    });
    opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
      if (cardList.tools.length > 0) {
        pokemonsWithTool += 1;
      }
    });

    const stadiumCard = StateUtils.getStadiumCard(state);

    if (pokemonsWithTool === 0 && stadiumCard === undefined) {
      return false;
    }

    if (player.hand.cards.length < 2) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let pokemonsWithTool = 0;
      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.tools.length > 0) {
          pokemonsWithTool += 1;
        } else {
          blocked.push(target);
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.tools.length > 0) {
          pokemonsWithTool += 1;
        } else {
          blocked.push(target);
        }
      });

      const stadiumCard = StateUtils.getStadiumCard(state);

      if (pokemonsWithTool === 0 && stadiumCard == undefined) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      let cards: Card[] = [];

      cards = player.hand.cards;

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      // prepare card list without Junk Arm
      const handTemp = new CardList();
      handTemp.cards = player.hand.cards;

      store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          handTemp,
          {},
          { min: 1, max: 1, allowCancel: false },
        ),
        (selected) => {
          cards = selected || [];
          // Operation canceled by the user
          if (cards.length === 0) {
            return state;
          }
          MOVE_CARDS(store, state, player.hand, player.lostzone, {
            cards: cards,
            sourceCard: this,
          });
        },
      );

      if (pokemonsWithTool >= 1 && stadiumCard !== undefined) {
        const options: { message: GameMessage; action: () => void }[] = [
          {
            message: GameMessage.CHOICE_TOOL,
            action: () => {
              // We will discard this card after prompt confirmation
              effect.preventDefault = true;

              const max = Math.min(1, pokemonsWithTool);
              let targets: PokemonCardList[] = [];
              return store.prompt(
                state,
                new ChoosePokemonPrompt(
                  player.id,
                  GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
                  PlayerType.ANY,
                  [SlotType.ACTIVE, SlotType.BENCH],
                  { min: 1, max: max, allowCancel: false, blocked },
                ),
                (results) => {
                  targets = results || [];

                  if (targets.length === 0) {
                    return state;
                  }

                  targets.forEach((target) => {
                    const owner = StateUtils.findOwner(state, target);
                    if (target.tools.length === 1) {
                      // Only one tool, move it directly
                      MOVE_CARDS(store, state, target, owner.lostzone, {
                        cards: [target.tools[0]],
                        sourceCard: this,
                      });
                    } else if (target.tools.length > 1) {
                      // Multiple tools, prompt to choose one
                      const toolList = new CardList();
                      toolList.cards = [...target.tools];
                      return store.prompt(
                        state,
                        new ChooseCardsPrompt(
                          player,
                          GameMessage.CHOOSE_CARD_TO_DISCARD,
                          toolList,
                          { trainerType: TrainerType.TOOL },
                          { min: 1, max: 1, allowCancel: false },
                        ),
                        (selectedTools) => {
                          if (selectedTools && selectedTools.length === 1) {
                            const tool = selectedTools[0];
                            MOVE_CARDS(store, state, target, owner.lostzone, {
                              cards: [tool],
                              sourceCard: this,
                            });
                          }
                          MOVE_CARDS(store, state, player.supporter, player.discard, {
                            cards: [this],
                            sourceCard: this,
                          });
                          return state;
                        },
                      );
                    }
                    MOVE_CARDS(store, state, player.supporter, player.discard, {
                      cards: [this],
                      sourceCard: this,
                    });
                    return state;
                  });

                  MOVE_CARDS(store, state, player.supporter, player.discard, {
                    cards: [this],
                    sourceCard: this,
                  });
                  return state;
                },
              );
            },
          },
          {
            message: GameMessage.CHOICE_STADIUM,
            action: () => {
              const stadiumCard = StateUtils.getStadiumCard(state);
              if (stadiumCard == undefined) {
                throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
              }

              // Discard Stadium
              const cardList = StateUtils.findCardList(state, stadiumCard);
              const owner = StateUtils.findOwner(state, cardList);
              MOVE_CARDS(store, state, cardList, owner.lostzone, { sourceCard: this });

              MOVE_CARDS(store, state, player.supporter, player.discard, {
                cards: [this],
                sourceCard: this,
              });
              return state;
            },
          },
        ];
        return store.prompt(
          state,
          new SelectOptionPrompt(
            player.id,
            GameMessage.DISCARD_STADIUM_OR_TOOL,
            options.map((c) => c.message),
            { allowCancel: false },
          ),
          (choice) => {
            const option = options[choice];

            if (option.action) {
              option.action();
            }
            MOVE_CARDS(store, state, player.supporter, player.discard, {
              cards: [this],
              sourceCard: this,
            });
            return state;
          },
        );
      }
      if (pokemonsWithTool === 0 && stadiumCard !== undefined) {
        const stadiumCard = StateUtils.getStadiumCard(state);
        if (stadiumCard == undefined) {
          throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
        }

        // Discard Stadium
        const cardList = StateUtils.findCardList(state, stadiumCard);
        const owner = StateUtils.findOwner(state, cardList);
        MOVE_CARDS(store, state, cardList, owner.discard, { sourceCard: this });

        MOVE_CARDS(store, state, player.supporter, player.discard, {
          cards: [this],
          sourceCard: this,
        });
        return state;
      }

      if (pokemonsWithTool >= 1 && stadiumCard == undefined) {
        // We will discard this card after prompt confirmation
        effect.preventDefault = true;

        const max = Math.min(1, pokemonsWithTool);
        let targets: PokemonCardList[] = [];
        return store.prompt(
          state,
          new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
            PlayerType.ANY,
            [SlotType.ACTIVE, SlotType.BENCH],
            { min: 1, max: max, allowCancel: false, blocked },
          ),
          (results) => {
            targets = results || [];

            if (targets.length === 0) {
              return state;
            }

            targets.forEach((target) => {
              const owner = StateUtils.findOwner(state, target);
              if (target.tools.length === 1) {
                // Only one tool, move it directly
                MOVE_CARDS(store, state, target, owner.lostzone, {
                  cards: [target.tools[0]],
                  sourceCard: this,
                });
              } else if (target.tools.length > 1) {
                // Multiple tools, prompt to choose one
                const toolList = new CardList();
                toolList.cards = [...target.tools];
                return store.prompt(
                  state,
                  new ChooseCardsPrompt(
                    player,
                    GameMessage.CHOOSE_CARD_TO_DISCARD,
                    toolList,
                    { trainerType: TrainerType.TOOL },
                    { min: 1, max: 1, allowCancel: false },
                  ),
                  (selectedTools) => {
                    if (selectedTools && selectedTools.length === 1) {
                      const tool = selectedTools[0];
                      MOVE_CARDS(store, state, target, owner.lostzone, {
                        cards: [tool],
                        sourceCard: this,
                      });
                    }
                    MOVE_CARDS(store, state, player.supporter, player.discard, {
                      cards: [this],
                      sourceCard: this,
                    });
                    return state;
                  },
                );
              }
              MOVE_CARDS(store, state, player.supporter, player.discard, {
                cards: [this],
                sourceCard: this,
              });
              return state;
            });
          },
        );
      }
      return state;
    }
    return state;
  }
}
