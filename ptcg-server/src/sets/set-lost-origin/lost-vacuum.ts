import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { Card, CardList, ChooseCardsPrompt, ChooseToolPrompt, GameError, GameMessage, PlayerType, PokemonCardList, SelectPrompt, StateUtils } from '../../game';
import { LOST_ZONE_TOOL } from '../../game/store/prefabs/prefabs';

export class LostVacuum extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '162';

  public regulationMark = 'F';

  public name: string = 'Lost Vacuum';

  public fullName: string = 'Lost Vacuum LOR';

  public text: string =
    'You can use this card only if you put another card from your hand in the Lost Zone.' +
    '' +
    'Choose a Pokémon Tool attached to any Pokémon, or any Stadium in play, and put it in the Lost Zone.';

  // Add the need to select 1 card to lost zone from hand, then send to lost zone

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let allTools: Card[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        allTools.push(...cardList.tools);
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        allTools.push(...cardList.tools);
      });

      const stadiumCard = StateUtils.getStadiumCard(state);

      if (allTools.length === 0 && stadiumCard === undefined) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      let cards: Card[] = [];

      cards = player.hand.cards;

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      // prepare card list without Junk Arm
      const handTemp = new CardList();
      handTemp.cards = player.hand.cards;

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        handTemp,
        {},
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        cards = selected || [];
        // Operation canceled by the user
        if (cards.length === 0) {
          return state;
        }
        player.hand.moveCardsTo(cards, player.lostzone);
      });

      if (allTools.length > 0 && stadiumCard !== undefined) {

        const options: { message: GameMessage, action: () => void }[] = [
          {
            message: GameMessage.CHOICE_TOOL,
            action: () => {
              let selectedTools: Card[] = [];
              return store.prompt(state, new ChooseToolPrompt(
                player.id,
                GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
                allTools,
                { min: 1, max: 1, allowCancel: false }
              ), results => {
                selectedTools = results || [];

                if (selectedTools.length === 0) {
                  return state;
                }

                const source = StateUtils.findCardList(state, selectedTools[0]);
                if (!(source instanceof PokemonCardList)) {
                  return state;
                }

                selectedTools.forEach(tool => LOST_ZONE_TOOL(store, state, source, tool));

                player.supporter.moveCardTo(this, player.discard);
                return state;
              });
            }
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
              cardList.moveTo(owner.lostzone);

              player.supporter.moveCardTo(this, player.discard);
              return state;
            }

          }
        ];
        return store.prompt(state, new SelectPrompt(
          player.id,
          GameMessage.DISCARD_STADIUM_OR_TOOL,
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
      if (allTools.length === 0 && stadiumCard !== undefined) {
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

      if (allTools.length >= 1 && stadiumCard == undefined) {
        let selectedTools: Card[] = [];
        return store.prompt(state, new ChooseToolPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
          allTools,
          { min: 1, max: 1, allowCancel: false }
        ), results => {
          selectedTools = results || [];

          if (selectedTools.length === 0) {
            return state;
          }

          const source = StateUtils.findCardList(state, selectedTools[0]);
          if (!(source instanceof PokemonCardList)) {
            return state;
          }

          selectedTools.forEach(tool => LOST_ZONE_TOOL(store, state, source, tool));

          player.supporter.moveCardTo(this, player.discard);
          return state;
        });
      }
      return state;
    }
    return state;
  }
}
