import {
  Card,
  CardList,
  CardTag,
  PokemonCard,
  PokemonCardList,
  SuperType,
  TrainerCard,
  TrainerType,
} from 'ptcg-server';

/** Tools that attach to the opponent's Pokémon (Team Flare Hyper Gear, etc.). */
const OPPONENT_ATTACH_TOOL_NAME_PREFIXES = ['Jamming Net', 'Head Ringer'] as const;

export function isOpponentAttachToolName(name: string | undefined): boolean {
  if (!name) {
    return false;
  }
  return OPPONENT_ATTACH_TOOL_NAME_PREFIXES.some(
    prefix => name === prefix || name.startsWith(`${prefix} `)
  );
}

/**
 * Detect opponent-attach Pokémon Tools without `instanceof` (breaks across bundled copies).
 */
export function isOpponentAttachTool(card: Card): boolean {
  if (card.superType !== SuperType.TRAINER) {
    return false;
  }
  if (isOpponentAttachToolName(card.name) || isOpponentAttachToolName(card.fullName)) {
    return true;
  }
  const trainer = card as TrainerCard;
  if (trainer.attachesToOpponentsPokemon === true) {
    return true;
  }
  return trainer.trainerType === TrainerType.TOOL && isOpponentAttachToolName(card.name);
}

/** Opponent's Pokémon-EX / Pokémon ex with no tool attached (Jamming Net, Head Ringer). */
export function isOpponentPokemonExToolTarget(cardList: CardList | PokemonCardList | undefined): boolean {
  if (!cardList?.cards?.length) {
    return false;
  }
  const pokemonCardList = cardList as PokemonCardList;
  const pokemon =
    typeof pokemonCardList.getPokemonCard === 'function'
      ? pokemonCardList.getPokemonCard()
      : (cardList.cards[cardList.cards.length - 1] as PokemonCard);
  if (!pokemon || pokemon.superType !== SuperType.POKEMON) {
    return false;
  }
  if (pokemonCardList.tools && pokemonCardList.tools.length > 0) {
    return false;
  }
  return (
    pokemon.tags.includes(CardTag.POKEMON_EX) || pokemon.tags.includes(CardTag.POKEMON_ex)
  );
}
