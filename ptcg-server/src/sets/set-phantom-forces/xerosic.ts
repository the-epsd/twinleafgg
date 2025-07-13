import { Card, CardTarget, ChooseCardsPrompt, ChoosePokemonPrompt, EnergyCard, GameError, GameMessage, PlayerType, PokemonCardList, SelectPrompt, SlotType, StateUtils } from '../../game';
import { EnergyType, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { SupporterEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Xerosic extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'PHF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '110';

  public name: string = 'Xerosic';

  public fullName: string = 'Xerosic PHF';

  public text: string =
    'Choose a Pokémon Tool or Special Energy card attached to a Pokémon in play (yours or your opponent\'s) and discard it.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      let pokemonsWithTool = 0;
      const blocked: CardTarget[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.tools.length > 0) {
          pokemonsWithTool += 1;
        } else {
          blocked.push(target);
        }
      });
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.tools.length > 0) {
          pokemonsWithTool += 1;
        } else {
          blocked.push(target);
        }
      });

      let specialEnergy = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.cards.some(c => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL)) {
          specialEnergy += 1;
        }
      });
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.cards.some(c => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL)) {
          specialEnergy += 1;
        }
      });

      if (pokemonsWithTool === 0 && specialEnergy === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;
      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      const toolOption = {
        message: GameMessage.CHOICE_TOOL,
        action: () => {
          let targets: PokemonCardList[] = [];
          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
            PlayerType.ANY,
            [SlotType.ACTIVE, SlotType.BENCH],
            { min: 1, max: 1, allowCancel: false, blocked }
          ), results => {
            targets = results || [];

            if (targets.length === 0) {
              return state;
            }

            const cardList = targets[0];

            if (cardList.isStage(Stage.BASIC)) {
              try {
                const supporterEffect = new SupporterEffect(player, effect.trainerCard);
                store.reduceEffect(state, supporterEffect);
              } catch {
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
              }
            }

            targets.forEach(target => {
              const owner = StateUtils.findOwner(state, target);
              if (target.tools.length > 0) {
                if (target.tools.length > 1) {
                  return store.prompt(state, new ChooseCardsPrompt(
                    player,
                    GameMessage.CHOOSE_CARD_TO_DISCARD,
                    target,
                    { superType: SuperType.TRAINER, trainerType: TrainerType.TOOL },
                    { min: 1, max: 1, allowCancel: false }
                  ), selected => {
                    if (selected && selected.length > 0) {
                      target.moveCardTo(selected[0], owner.discard);
                    }
                    player.supporter.moveCardTo(this, player.discard);
                    return state;
                  });
                } else {
                  target.moveCardTo(target.tools[0], owner.discard);
                }
              }
              player.supporter.moveCardTo(this, player.discard);
              return state;
            });

            player.supporter.moveCardTo(this, player.discard);
            return state;
          });
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
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
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
            PlayerType.ANY,
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
                target.moveCardsTo(cards, opponent.discard);
              }

              return state;
            });
          });
        }
      };

      const options: { message: GameMessage, action: () => void }[] = [];

      if (pokemonsWithTool > 0) {
        options.push(toolOption);
      }

      if (specialEnergy > 0) {
        options.push(specialEnergyOption);
      }

      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_OPTION,
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
