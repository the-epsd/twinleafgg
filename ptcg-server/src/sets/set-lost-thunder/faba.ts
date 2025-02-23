import { Card, CardTarget, ChooseCardsPrompt, ChoosePokemonPrompt, EnergyCard, GameError, GameMessage, PlayerType, SelectPrompt, SlotType, StateUtils } from '../../game';
import { EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CHOOSE_TOOLS_TO_REMOVE_PROMPT } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Faba extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'LOT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '173';

  public name: string = 'Faba';

  public fullName: string = 'Faba LOT';

  public text: string =
    'Choose a Pokémon Tool or Special Energy card attached to 1 of your opponent\'s Pokémon, or any Stadium card in play, and put it in the Lost Zone.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      let tools = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        tools += cardList.tools.length;
      });

      let specialEnergy = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.cards.some(c => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL)) {
          specialEnergy += 1;
        }
      });

      const stadiumCard = StateUtils.getStadiumCard(state);

      if (tools === 0 && stadiumCard == undefined && specialEnergy === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;
      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      const toolOption = {
        message: GameMessage.CHOICE_TOOL,
        action: () => {
          return CHOOSE_TOOLS_TO_REMOVE_PROMPT(store, state, player, PlayerType.TOP_PLAYER, SlotType.LOSTZONE, 1, 1);
        }
      };

      const stadiumOption = {
        message: GameMessage.CHOICE_STADIUM,
        action: () => {
          const stadiumCard = StateUtils.getStadiumCard(state);
          if (stadiumCard == undefined) {
            throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
          }

          // Discard Stadium
          const cardList = StateUtils.findCardList(state, stadiumCard);
          const owner = StateUtils.findOwner(state, cardList);
          cardList.moveTo(owner.lostzone);

          player.supporter.moveCardTo(this, player.discard);
          return state;
        }
      };

      const specialEnergyBlocked: CardTarget[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.cards.some(c => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL)) {
          return;
        } else {
          specialEnergyBlocked.push(target);
        }
      });

      const specialEnergyOption = {
        message: GameMessage.CHOICE_SPECIAL_ENERGY,
        action: () => {
          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
            PlayerType.TOP_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            { allowCancel: false, blocked: specialEnergyBlocked }
          ), results => {

            if (results.length === 0) {
              return state;
            }

            const target = results[0];
            let cards: Card[] = [];

            state = store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_DISCARD,
              target,
              { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
              { min: 1, max: 1, allowCancel: false }
            ), selected => {
              cards = selected || [];
              if (cards.length > 0) {
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                target.moveCardsTo(cards, opponent.lostzone);
              }

              return state;
            });
          });
        }
      };

      const options: { message: GameMessage, action: () => void }[] = [];

      if (tools > 0) {
        options.push(toolOption);
      }

      if (specialEnergy > 0) {
        options.push(specialEnergyOption);
      }

      if (stadiumCard !== undefined) {
        options.push(stadiumOption);
      }

      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.DISCARD_STADIUM_OR_TOOL_OR_SPECIAL_ENERGY,
        options.map(c => c.message),
        { allowCancel: false }
      ), choice => {
        const option = options[choice];

        if (option.action) {
          option.action();
        }

        player.supporter.moveCardTo(this, player.discard);
        return state;
      });

    }
    return state;
  }
}
