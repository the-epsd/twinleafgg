import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, EnergyType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, EnergyCard, PokemonCardList, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';


export class MegatonBlower extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public tags = [CardTag.ACE_SPEC];

  public set: string = 'SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '182';

  public regulationMark = 'H';

  public name: string = 'Megaton Blower';

  public fullName: string = 'Megaton Blower SV7a';

  public text: string =
    'You can use this card only if you go second, and only on your first turn.' +
    '' +
    'Search your deck for a Supporter card, reveal it, and put it into your hand. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      effect.preventDefault = true;
      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const stadiumCard = StateUtils.getStadiumCard(state);
      const cardList = StateUtils.findCardList(state, stadiumCard!);
      const stadiumOwner = StateUtils.findOwner(state, cardList);
      cardList.moveTo(stadiumOwner.discard);

      const opponent = StateUtils.getOpponent(state, player);

      // Function to discard special energy and tools from a PokemonCardList
      const discardSpecialEnergyAndTools = (pokemonCardList: PokemonCardList) => {
        const cardsToDiscard = pokemonCardList.cards.filter(card =>
          (card instanceof EnergyCard && card.energyType === EnergyType.SPECIAL) ||
          (card instanceof TrainerCard && card.trainerType === TrainerType.TOOL)
        );
        pokemonCardList.moveCardsTo(cardsToDiscard, opponent.discard);
      };

      // Discard from active Pokémon
      discardSpecialEnergyAndTools(opponent.active);

      // Discard from bench Pokémon
      opponent.bench.forEach(benchPokemon => {
        discardSpecialEnergyAndTools(benchPokemon);
      });

      player.supporter.moveCardTo(this, player.discard);
    }
    return state;
  }
}