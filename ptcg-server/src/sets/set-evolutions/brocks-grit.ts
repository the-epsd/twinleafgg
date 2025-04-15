import { Card } from '../../game/store/card/card';
import { GameError } from '../../game/game-error';
import { GameLog, GameMessage } from '../../game/game-message';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { EnergyCard } from '../../game/store/card/energy-card';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';

export class BrocksGrit extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'EVO';
  public name: string = 'Brock\'s Grit';
  public fullName: string = 'Brock\'s Grit EVO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';

  public text: string =
    'Shuffle 6 in any combination of Pokémon and basic Energy cards from your discard pile into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      let pokemonsOrEnergyInDiscard: number = 0;
      const blocked: number[] = [];
      player.discard.cards.forEach((c, index) => {
        const isPokemon = c instanceof PokemonCard;
        const isBasicEnergy = c instanceof EnergyCard && c.energyType === EnergyType.BASIC;
        if (isPokemon || isBasicEnergy) {
          pokemonsOrEnergyInDiscard += 1;
        } else {
          blocked.push(index);
        }
      });

      // Player does not have correct cards in discard
      if (pokemonsOrEnergyInDiscard === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      let cards: Card[] = [];
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DECK,
        player.discard,
        {},
        { min: 1, max: 6, allowCancel: false, blocked }
      ), selected => {
        cards = selected || [];
        cards.forEach((card) => {
          store.log(state, GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
        });
        player.discard.moveCardsTo(cards, player.deck);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }

    return state;
  }

}
