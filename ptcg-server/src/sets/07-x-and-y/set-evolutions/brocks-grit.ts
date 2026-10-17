import { Card } from '../../../game/store/card/card';
import { EnergyType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { GameError, GameMessage, Player, State, StoreLike } from '../../../game';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class BrocksGrit extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'EVO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = "Brock's Grit";
  public fullName: string = "Brock's Grit EVO";
  public text: string =
    'Shuffle 6 in any combination of Pokémon and basic Energy cards from your discard pile into your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return player.discard.cards.some((c) => {
      const isPokemon = c instanceof PokemonCard;
      const isBasicEnergy = c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC;
      return isPokemon || isBasicEnergy;
    });
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      let pokemonsOrEnergyInDiscard = 0;
      const blocked: number[] = [];
      player.discard.cards.forEach((c, index) => {
        const isPokemon = c instanceof PokemonCard;
        const isBasicEnergy = c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC;
        if (isPokemon || isBasicEnergy) {
          pokemonsOrEnergyInDiscard += 1;
        } else {
          blocked.push(index);
        }
      });

      if (pokemonsOrEnergyInDiscard === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DECK,
          player.discard,
          {},
          { min: 1, max: 6, allowCancel: false, blocked },
        ),
        (selected) => {
          const cards: Card[] = selected || [];
          MOVE_CARDS(store, state, player.discard, player.deck, { cards, sourceCard: this });
          SHUFFLE_DECK(store, state, player);
        },
      );
    }

    return state;
  }
}
