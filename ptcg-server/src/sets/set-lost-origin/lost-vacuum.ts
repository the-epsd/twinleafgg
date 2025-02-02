import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { Card, CardList, CardTarget, ChooseCardsPrompt, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PokemonCardList, SelectPrompt, SlotType, StateUtils } from '../../game';

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

      let pokemonsWithTool = 0;
      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.tool !== undefined) {
          pokemonsWithTool += 1;
        } else {
          blocked.push(target);
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.tool !== undefined) {
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

      if (pokemonsWithTool >= 1 && stadiumCard !== undefined) {

        const options: { message: GameMessage, action: () => void }[] = [
          {
            message: GameMessage.CHOICE_TOOL,
            action: () => {

              // We will discard this card after prompt confirmation
              effect.preventDefault = true;

              const max = Math.min(1, pokemonsWithTool);
              let targets: PokemonCardList[] = [];
              return store.prompt(state, new ChoosePokemonPrompt(
                player.id,
                GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
                PlayerType.ANY,
                [SlotType.ACTIVE, SlotType.BENCH],
                { min: 1, max: max, allowCancel: false, blocked }
              ), results => {
                targets = results || [];

                if (targets.length === 0) {
                  return state;
                }

                targets.forEach(target => {
                  const owner = StateUtils.findOwner(state, target);
                  if (target.tool !== undefined) {
                    target.moveCardTo(target.tool, owner.lostzone);
                    target.tool = undefined;
                  }

                  player.supporter.moveCardTo(this, player.discard);
                  return state;
                });

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
      if (pokemonsWithTool === 0 && stadiumCard !== undefined) {
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

      if (pokemonsWithTool >= 1 && stadiumCard == undefined) {

        // We will discard this card after prompt confirmation
        effect.preventDefault = true;

        const max = Math.min(1, pokemonsWithTool);
        let targets: PokemonCardList[] = [];
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
          PlayerType.ANY,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: max, allowCancel: false, blocked }
        ), results => {
          targets = results || [];

          if (targets.length === 0) {
            return state;
          }

          targets.forEach(target => {
            const owner = StateUtils.findOwner(state, target);
            if (target.tool !== undefined) {
              target.moveCardTo(target.tool, owner.lostzone);
              target.tool = undefined;
              player.supporter.moveCardTo(this, player.discard);
            }

            player.supporter.moveCardTo(this, player.discard);
            return state;
          });
        });
      }
      return state;
    }
    return state;
  }
}
