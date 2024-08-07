import { ChoosePokemonPrompt, GameLog, GameMessage, PlayerType, PokemonCard, SlotType, TrainerCard } from '../../game';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class ScoopUpNet extends TrainerCard {
  public name = 'Scoop Up Net';
  public setNumber = '165';
  public set = 'RCL';
  public fullName = 'Scoop Up Net RCL';
  public superType = SuperType.TRAINER;
  public trainerType = TrainerType.ITEM;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          effect.player.id,
          GameMessage.CHOOSE_POKEMON,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false, min: 1, max: 1 }
        ),
        (results) => {
          if (results && results.length > 0) {
            const targetPokemon = results[0];

            if (targetPokemon === effect.player.active) {
              return store.prompt(state, new ChoosePokemonPrompt(
                player.id,
                GameMessage.CHOOSE_POKEMON_TO_SWITCH,
                PlayerType.BOTTOM_PLAYER,
                [SlotType.BENCH],
                { allowCancel: false }
              ), result => {
                const cardList = result[0];
                targetPokemon.damage = 0;
                targetPokemon.clearEffects();
                targetPokemon.cards.forEach((card, index) => {
                  if (card instanceof PokemonCard) {
                    store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: effect.player.name, card: card.name });
                  }
                });

                player.switchPokemon(cardList);

                const scoopedPokemon = targetPokemon.cards.filter(c => c instanceof PokemonCard)[0];
                const benchedCardList = player.bench.find(b => b.cards.includes(scoopedPokemon));
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                benchedCardList!.moveCardsTo(benchedCardList!.cards.filter(c => c instanceof PokemonCard), effect.player.hand);
                benchedCardList!.moveCardsTo(benchedCardList!.cards.filter(c => !(c instanceof PokemonCard)), effect.player.discard);
              });
            } else {
              targetPokemon.moveCardsTo(targetPokemon.cards.filter(c => c instanceof PokemonCard), effect.player.hand);
              targetPokemon.moveCardsTo(targetPokemon.cards.filter(c => !(c instanceof PokemonCard)), effect.player.discard);
              targetPokemon.clearEffects();
              player.supporter.moveCardTo(effect.trainerCard, player.discard);
              targetPokemon.cards.forEach((card, index) => {
                if (card instanceof PokemonCard) {
                  store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: effect.player.name, card: card.name });
                }
              });
            }
          }

          return state;
        }
      );
    }

    return state;
  }
}
