import {
  CardTarget,
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  EnergyCard,
  GameError,
  GameMessage,
  Player,
  PlayerType,
  PokemonCardList,
  SlotType,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
} from '../../../game';
import { EnergyType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function opponentHasSpecialEnergy(state: State, player: Player): boolean {
  const opponent = StateUtils.getOpponent(state, player);
  let found = false;
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
    if (cardList.energies.cards.some((c) => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL)) {
      found = true;
    }
  });
  return found;
}

export class LostRemover extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'CL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '80';
  public name: string = 'Lost Remover';
  public fullName: string = 'Lost Remover CL';
  public text: string =
    "Put 1 Special Energy card attached to 1 of your opponent's Pokémon in the Lost Zone.";

  public canPlay(_store: StoreLike, state: State, player: Player): boolean {
    return opponentHasSpecialEnergy(state, player);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!opponentHasSpecialEnergy(state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const blocked: CardTarget[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, _card, target) => {
        if (!cardList.energies.cards.some((c) => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL)) {
          blocked.push(target);
        }
      });

      effect.preventDefault = true;

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false, blocked },
        ),
        (results) => {
          const targets = results || [];
          if (targets.length === 0) {
            return;
          }

          const target = targets[0] as PokemonCardList;
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
              MOVE_CARDS(store, state, target.energies, opponent.lostzone, {
                cards: selected,
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
