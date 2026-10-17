import {
  CardTarget,
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  GameError,
  GameMessage,
  Player,
  PlayerType,
  SelectPrompt,
  SlotType,
  StateUtils,
} from '../../../game';
import { EnergyType, Stage, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { SupporterEffect } from '../../../game/store/effects/play-card-effects';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

// Finds the Pokemon in play (both players) that have a Tool or a Special Energy attached
function scanBoard(state: State, player: Player) {
  const opponent = StateUtils.getOpponent(state, player);
  const toolBlocked: CardTarget[] = [];
  const specialEnergyBlocked: CardTarget[] = [];
  let pokemonWithTool = 0;
  let pokemonWithSpecialEnergy = 0;

  const scan = (owner: Player, playerType: PlayerType) => {
    owner.forEachPokemon(playerType, (cardList, card, target) => {
      if (cardList.tools.length > 0) {
        pokemonWithTool += 1;
      } else {
        toolBlocked.push(target);
      }

      if (cardList.energies.cards.some((c) => c.energyType === EnergyType.SPECIAL)) {
        pokemonWithSpecialEnergy += 1;
      } else {
        specialEnergyBlocked.push(target);
      }
    });
  };

  scan(opponent, PlayerType.TOP_PLAYER);
  scan(player, PlayerType.BOTTOM_PLAYER);

  return { toolBlocked, specialEnergyBlocked, pokemonWithTool, pokemonWithSpecialEnergy };
}

export class Xerosic extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'PHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '110';
  public name: string = 'Xerosic';
  public fullName: string = 'Xerosic PHF';
  public text: string =
    "Choose a Pokémon Tool or Special Energy card attached to a Pokémon in play (yours or your opponent's) and discard it.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }

    const { pokemonWithTool, pokemonWithSpecialEnergy } = scanBoard(state, player);
    return pokemonWithTool > 0 || pokemonWithSpecialEnergy > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      const { toolBlocked, specialEnergyBlocked, pokemonWithTool, pokemonWithSpecialEnergy } =
        scanBoard(state, player);

      if (pokemonWithTool === 0 && pokemonWithSpecialEnergy === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      const toolOption = {
        message: GameMessage.CHOICE_TOOL,
        action: () => {
          store.prompt(
            state,
            new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
              PlayerType.ANY,
              [SlotType.ACTIVE, SlotType.BENCH],
              { min: 1, max: 1, allowCancel: false, blocked: toolBlocked },
            ),
            (results) => {
              if (!results || results.length === 0) {
                return;
              }

              const target = results[0];

              if (target.isStage(Stage.BASIC)) {
                try {
                  const supporterEffect = new SupporterEffect(player, effect.trainerCard);
                  store.reduceEffect(state, supporterEffect);
                } catch {
                  return;
                }
              }

              if (target.tools.length === 0) {
                return;
              }

              const owner = StateUtils.findOwner(state, target);

              if (target.tools.length === 1) {
                MOVE_CARDS(store, state, target, owner.discard, {
                  cards: [target.tools[0]],
                  sourceCard: this,
                });
                return;
              }

              store.prompt(
                state,
                new ChooseCardsPrompt(
                  player,
                  GameMessage.CHOOSE_CARD_TO_DISCARD,
                  target,
                  { superType: SuperType.TRAINER, trainerType: TrainerType.TOOL },
                  { min: 1, max: 1, allowCancel: false },
                ),
                (selected) => {
                  if (selected && selected.length > 0) {
                    MOVE_CARDS(store, state, target, owner.discard, {
                      cards: [selected[0]],
                      sourceCard: this,
                    });
                  }
                },
              );
            },
          );
        },
      };

      const specialEnergyOption = {
        message: GameMessage.CHOICE_SPECIAL_ENERGY,
        action: () => {
          store.prompt(
            state,
            new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
              PlayerType.ANY,
              [SlotType.ACTIVE, SlotType.BENCH],
              { allowCancel: false, blocked: specialEnergyBlocked },
            ),
            (results) => {
              if (!results || results.length === 0) {
                return;
              }

              const target = results[0];
              const owner = StateUtils.findOwner(state, target);

              store.prompt(
                state,
                new ChooseCardsPrompt(
                  player,
                  GameMessage.CHOOSE_CARD_TO_DISCARD,
                  target.energies,
                  { energyType: EnergyType.SPECIAL },
                  { min: 1, max: 1, allowCancel: false },
                ),
                (selected) => {
                  const cards = selected || [];
                  if (cards.length > 0) {
                    MOVE_CARDS(store, state, target, owner.discard, {
                      cards,
                      sourceCard: this,
                    });
                  }
                },
              );
            },
          );
        },
      };

      const options: { message: GameMessage; action: () => void }[] = [];

      if (pokemonWithTool > 0) {
        options.push(toolOption);
      }

      if (pokemonWithSpecialEnergy > 0) {
        options.push(specialEnergyOption);
      }

      return store.prompt(
        state,
        new SelectPrompt(
          player.id,
          GameMessage.CHOOSE_OPTION,
          options.map((c) => c.message),
          { allowCancel: false },
        ),
        (choice) => {
          options[choice].action();
        },
      );
    }

    return state;
  }
}
