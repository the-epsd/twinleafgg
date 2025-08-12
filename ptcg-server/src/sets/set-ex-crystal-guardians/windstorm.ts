import { CardTarget, ChoosePokemonPrompt, GameError, GameLog, GameMessage, PlayerType, PokemonCardList, SelectPrompt, SlotType, StateUtils } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CLEAN_UP_SUPPORTER, MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Windstorm extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'CG';
  public name: string = 'Windstorm';
  public fullName: string = 'Windstorm CG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';

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

      if (pokemonsWithTool >= 1 && stadiumCard !== undefined) {
        const options: { message: GameMessage, action: () => void }[] = [
          {
            message: GameMessage.YES,
            action: () => {
              const cardList = StateUtils.findCardList(state, stadiumCard);
              const stadiumPlayer = StateUtils.findOwner(state, cardList);
              MOVE_CARDS(store, state, cardList, stadiumPlayer.discard, { sourceCard: this });
              store.log(state, GameLog.LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER, { name: player.name, card: stadiumCard.name, effectName: this.name });

              let targets: PokemonCardList[] = [];
              return store.prompt(state, new ChoosePokemonPrompt(
                player.id,
                GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
                PlayerType.ANY,
                [SlotType.ACTIVE, SlotType.BENCH],
                { min: 0, max: 1, allowCancel: false, blocked }
              ), results => {
                targets = results || [];
                targets.forEach(target => {
                  const owner = StateUtils.findOwner(state, target);
                  if (target.tools.length > 0) {
                    target.moveCardTo(target.tools[0], owner.discard);
                    store.log(state, GameLog.LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER, { name: player.name, card: target.tools[0].name, effectName: this.name });
                  }
                });
                CLEAN_UP_SUPPORTER(effect, player);
                return state;
              });
            }
          },
          {
            message: GameMessage.NO,
            action: () => {
              const max = Math.min(2, pokemonsWithTool);
              let targets: PokemonCardList[] = [];
              return store.prompt(state, new ChoosePokemonPrompt(
                player.id,
                GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
                PlayerType.ANY,
                [SlotType.ACTIVE, SlotType.BENCH],
                { min: 0, max: max, allowCancel: false, blocked }
              ), results => {
                targets = results || [];
                targets.forEach(target => {
                  const owner = StateUtils.findOwner(state, target);
                  if (target.tools.length > 0) {
                    target.moveCardTo(target.tools[0], owner.discard);
                    store.log(state, GameLog.LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER, { name: player.name, card: target.tools[0].name });
                  }
                });
                CLEAN_UP_SUPPORTER(effect, player);
                return state;
              });
            }
          }
        ];

        return store.prompt(state, new SelectPrompt(
          player.id,
          GameMessage.WANT_TO_DISCARD_STADIUM,
          options.map(c => c.message),
          { allowCancel: false }
        ), choice => {
          const option = options[choice];
          if (option.action) {
            option.action();
          }
          return state;
        });
      } else if (pokemonsWithTool === 0 && stadiumCard !== undefined) {
        // Discard Stadium
        const cardList = StateUtils.findCardList(state, stadiumCard);
        const owner = StateUtils.findOwner(state, cardList);
        MOVE_CARDS(store, state, cardList, owner.discard, { sourceCard: this });
        store.log(state, GameLog.LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER, { name: player.name, card: stadiumCard.name });
        player.supporter.moveCardTo(this, player.discard);
        return state;
      } else if (pokemonsWithTool >= 1 && stadiumCard == undefined) {
        const max = Math.min(2, pokemonsWithTool);
        let targets: PokemonCardList[] = [];
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
          PlayerType.ANY,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: max, allowCancel: false, blocked }
        ), results => {
          targets = results || [];
          targets.forEach(target => {
            const owner = StateUtils.findOwner(state, target);
            if (target.tools.length > 0) {
              target.moveCardTo(target.tools[0], owner.discard);
              store.log(state, GameLog.LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER, { name: player.name, card: target.tools[0].name });
            }
          });
          player.supporter.moveCardTo(this, player.discard);
          return state;
        });
      }
      return state;
    }
    return state;
  }
}
