import { CardTarget, ChoosePokemonPrompt, GameError, GameLog, GameMessage, PlayerType, PokemonCardList, SelectPrompt, SlotType, StateUtils } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { CardList } from '../../game/store/state/card-list';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';

export class FieldBlower extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'GRI';

  public name: string = 'Field Blower';

  public fullName: string = 'Field Blower GRI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '125';

  public text: string =
    'Choose up to 2 in any combination of Pokémon Tool cards and Stadium cards in play (yours or your opponent\'s) and discard them.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
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

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;
      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      // Helper to discard a tool from a Pokemon, with prompt if more than one tool
      const self = this;
      function discardToolFromPokemon(pokemon: PokemonCardList, owner: any, max: number, cb: () => void) {
        if (pokemon.tools.length === 1) {
          pokemon.moveCardTo(pokemon.tools[0], owner.discard);
          store.log(state, GameLog.LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER, { name: player.name, card: pokemon.tools[0].name, effectName: self.name });
          cb();
        } else if (pokemon.tools.length > 1) {
          const toolList = new CardList();
          toolList.cards = [...pokemon.tools];
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD, // You may want a new message for 'choose tool(s) to discard'
            toolList,
            { trainerType: TrainerType.TOOL },
            { min: 1, max: Math.min(max, pokemon.tools.length), allowCancel: false }
          ), selectedTools => {
            if (selectedTools && selectedTools.length > 0) {
              selectedTools.forEach(tool => {
                pokemon.moveCardTo(tool, owner.discard);
                store.log(state, GameLog.LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER, { name: player.name, card: tool.name, effectName: self.name });
              });
            }
            cb();
          });
        } else {
          cb();
        }
      }

      // Main logic
      if (pokemonsWithTool >= 1 && stadiumCard !== undefined) {
        // Both Stadium and Pokémon tools in play
        return store.prompt(state, new SelectPrompt(
          player.id,
          GameMessage.WANT_TO_DISCARD_STADIUM,
          [GameMessage.YES, GameMessage.NO],
          { allowCancel: false }
        ), choice => {
          if (choice === 0) { // YES, discard Stadium
            const cardList = StateUtils.findCardList(state, stadiumCard);
            const owner = StateUtils.findOwner(state, cardList);
            MOVE_CARDS(store, state, cardList, owner.discard, { sourceCard: self });
            store.log(state, GameLog.LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER, { name: player.name, card: stadiumCard.name, effectName: self.name });
            // Now allow up to 1 Pokémon tool discard
            return store.prompt(state, new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
              PlayerType.ANY,
              [SlotType.ACTIVE, SlotType.BENCH],
              { min: 0, max: 1, allowCancel: false, blocked }
            ), results => {
              const targets = results || [];
              if (targets.length === 1) {
                const target = targets[0];
                const owner = StateUtils.findOwner(state, target);
                discardToolFromPokemon(target, owner, 1, () => {
                  player.supporter.moveCardTo(self, player.discard);
                });
              } else {
                player.supporter.moveCardTo(self, player.discard);
              }
              return state;
            });
          } else { // NO, allow up to 2 Pokémon tool discards
            return store.prompt(state, new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
              PlayerType.ANY,
              [SlotType.ACTIVE, SlotType.BENCH],
              { min: 1, max: 2, allowCancel: false, blocked }
            ), results => {
              const targets = results || [];
              function discardNext(i: number) {
                if (i >= targets.length) {
                  player.supporter.moveCardTo(self, player.discard);
                  return;
                }
                const target = targets[i];
                const owner = StateUtils.findOwner(state, target);
                discardToolFromPokemon(target, owner, 1, () => discardNext(i + 1));
              }
              discardNext(0);
              return state;
            });
          }
        });
      } else if (pokemonsWithTool === 0 && stadiumCard !== undefined) {
        // Only Stadium
        const cardList = StateUtils.findCardList(state, stadiumCard);
        const owner = StateUtils.findOwner(state, cardList);
        MOVE_CARDS(store, state, cardList, owner.discard, { sourceCard: self });
        store.log(state, GameLog.LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER, { name: player.name, card: stadiumCard.name });
        player.supporter.moveCardTo(self, player.discard);
        return state;
      } else if (pokemonsWithTool >= 1 && stadiumCard == undefined) {
        // Only Pokémon tools
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
          PlayerType.ANY,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: 2, allowCancel: false, blocked }
        ), results => {
          const targets = results || [];
          function discardNext(i: number) {
            if (i >= targets.length) {
              player.supporter.moveCardTo(self, player.discard);
              return;
            }
            const target = targets[i];
            const owner = StateUtils.findOwner(state, target);
            discardToolFromPokemon(target, owner, 1, () => discardNext(i + 1));
          }
          discardNext(0);
          return state;
        });
      }
      return state;
    }
    return state;
  }
}
