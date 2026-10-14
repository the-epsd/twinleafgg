import {
  Card,
  CardTarget,
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  GameError,
  GameMessage,
  Player,
  PlayerType,
  PokemonCardList,
  SelectPrompt,
  SlotType,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
} from '../../../game';
import { EnergyType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Faba extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '173';
  public name: string = 'Faba';
  public fullName: string = 'Faba LOT';
  public text: string =
    "Choose a Pokémon Tool or Special Energy card attached to 1 of your opponent's Pokémon, or any Stadium card in play, and put it in the Lost Zone.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }

    const opponent = StateUtils.getOpponent(state, player);
    let hasTargets = StateUtils.getStadiumCard(state) !== undefined;
    opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
      if (cardList.tools.length > 0 || this.hasSpecialEnergy(cardList)) {
        hasTargets = true;
      }
    });
    return hasTargets;
  }

  private hasSpecialEnergy(cardList: PokemonCardList): boolean {
    return cardList.energies.cards.some(
      (c) => c.superType === SuperType.ENERGY && c.energyType === EnergyType.SPECIAL,
    );
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (!this.canPlay(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      let pokemonsWithTool = 0;
      let specialEnergy = 0;
      const toolBlocked: CardTarget[] = [];
      const specialEnergyBlocked: CardTarget[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.tools.length > 0) {
          pokemonsWithTool += 1;
        } else {
          toolBlocked.push(target);
        }

        if (this.hasSpecialEnergy(cardList)) {
          specialEnergy += 1;
        } else {
          specialEnergyBlocked.push(target);
        }
      });

      const stadiumCard = StateUtils.getStadiumCard(state);

      const toolOption = {
        message: GameMessage.CHOICE_TOOL,
        action: () => {
          return store.prompt(
            state,
            new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
              PlayerType.TOP_PLAYER,
              [SlotType.ACTIVE, SlotType.BENCH],
              { min: 1, max: 1, allowCancel: false, blocked: toolBlocked },
            ),
            (results) => {
              const targets = results || [];
              if (targets.length === 0) {
                return state;
              }

              const cardList = targets[0];
              const owner = StateUtils.findOwner(state, cardList);
              if (cardList.tools.length > 1) {
                return store.prompt(
                  state,
                  new ChooseCardsPrompt(
                    player,
                    GameMessage.CHOOSE_CARD_TO_DISCARD,
                    cardList,
                    { superType: SuperType.TRAINER, trainerType: TrainerType.TOOL },
                    { min: 1, max: 1, allowCancel: false },
                  ),
                  (selected) => {
                    if (selected && selected.length > 0) {
                      MOVE_CARDS(store, state, cardList, owner.lostzone, {
                        cards: [selected[0]],
                        sourceCard: this,
                      });
                    }
                    return state;
                  },
                );
              }

              if (cardList.tools.length > 0) {
                MOVE_CARDS(store, state, cardList, owner.lostzone, {
                  cards: [cardList.tools[0]],
                  sourceCard: this,
                });
              }
              return state;
            },
          );
        },
      };

      const stadiumOption = {
        message: GameMessage.CHOICE_STADIUM,
        action: () => {
          if (stadiumCard === undefined) {
            throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
          }

          const cardList = StateUtils.findCardList(state, stadiumCard);
          const owner = StateUtils.findOwner(state, cardList);
          MOVE_CARDS(store, state, cardList, owner.lostzone, { sourceCard: this });
          return state;
        },
      };

      const specialEnergyOption = {
        message: GameMessage.CHOICE_SPECIAL_ENERGY,
        action: () => {
          return store.prompt(
            state,
            new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
              PlayerType.TOP_PLAYER,
              [SlotType.ACTIVE, SlotType.BENCH],
              { allowCancel: false, blocked: specialEnergyBlocked },
            ),
            (results) => {
              if (!results || results.length === 0) {
                return state;
              }

              const target = results[0];
              return store.prompt(
                state,
                new ChooseCardsPrompt(
                  player,
                  GameMessage.CHOOSE_CARD_TO_DISCARD,
                  target,
                  { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
                  { min: 1, max: 1, allowCancel: false },
                ),
                (selected) => {
                  const cards: Card[] = selected || [];
                  if (cards.length > 0) {
                    MOVE_CARDS(store, state, target, opponent.lostzone, {
                      cards,
                      sourceCard: this,
                    });
                  }
                  return state;
                },
              );
            },
          );
        },
      };

      const options: { message: GameMessage; action: () => void }[] = [];

      if (pokemonsWithTool > 0) {
        options.push(toolOption);
      }

      if (specialEnergy > 0) {
        options.push(specialEnergyOption);
      }

      if (stadiumCard !== undefined) {
        options.push(stadiumOption);
      }

      return store.prompt(
        state,
        new SelectPrompt(
          player.id,
          GameMessage.DISCARD_STADIUM_OR_TOOL_OR_SPECIAL_ENERGY,
          options.map((c) => c.message),
          { allowCancel: false },
        ),
        (choice) => {
          const option = options[choice];
          if (option.action) {
            option.action();
          }
          return state;
        },
      );
    }

    return state;
  }
}
