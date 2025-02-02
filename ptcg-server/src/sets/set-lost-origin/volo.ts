import { TrainerCard, TrainerType, State, StoreLike, CardTag, GameError, GameMessage, CardTarget, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class Volo extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'F';

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '169';

  public name: string = 'Volo';

  public fullName: string = 'Volo LOR';

  public text: string =
    'Discard 1 of your Benched Pokémon V and all attached cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      let hasBenchedV: boolean = false;
      const blocked: CardTarget[] = [];

      player.bench.forEach((benchSpot, index) => {
        const pokemonCard = benchSpot.getPokemonCard();
        if (pokemonCard) {
          if (pokemonCard.tags.includes(CardTag.POKEMON_V) ||
            pokemonCard.tags.includes(CardTag.POKEMON_VSTAR) ||
            pokemonCard.tags.includes(CardTag.POKEMON_VMAX)) {
            hasBenchedV = true;
          } else {
            blocked.push({ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: index });
          }
        }
      });
      if (!hasBenchedV) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false, blocked }
      ), result => {
        const cardList = result.length > 0 ? result[0] : null;
        if (cardList !== null) {
          const pokemons = cardList.getPokemons();
          cardList.moveCardsTo(pokemons, player.discard);
          cardList.moveTo(player.discard);
          cardList.clearEffects();
          player.supporter.moveCardTo(effect.trainerCard, player.discard);

        }
      });
    }

    return state;
  }

}