import { Card, CardTag, PokemonCard, PokemonCardList, SuperType } from 'ptcg-server';

export interface BreakDisplayCards {
  mainCard: Card;
  breakCard: Card | undefined;
}

/**
 * Resolves which Pokemon card to show underneath a BREAK overlay.
 * BREAK sits on its immediate pre-evolution (e.g. Golduck), not the Basic.
 */
export function getBreakDisplayCards(cardList: PokemonCardList): BreakDisplayCards {
  const pokemonCard = cardList.getPokemonCard();

  if (!pokemonCard?.tags?.includes(CardTag.BREAK)) {
    return {
      mainCard: pokemonCard || cardList.cards[0],
      breakCard: undefined,
    };
  }

  const pokemons = cardList.getPokemons();
  const preEvolution = pokemons.length >= 2
    ? pokemons[pokemons.length - 2]
    : findBreakPreEvolution(cardList, pokemonCard);

  return {
    mainCard: preEvolution || pokemonCard,
    breakCard: pokemonCard,
  };
}

function findBreakPreEvolution(cardList: PokemonCardList, breakCard: PokemonCard): Card | undefined {
  const evolvesFrom = breakCard.evolvesFrom;
  if (!evolvesFrom) {
    return undefined;
  }

  return cardList.cards.find(card =>
    card.superType === SuperType.POKEMON &&
    !card.tags?.includes(CardTag.BREAK) &&
    (card.name === evolvesFrom || card.name.startsWith(`${evolvesFrom} `))
  );
}
