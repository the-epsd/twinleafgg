import type { Card, CardList, Player, PokemonCardList } from 'ptcg-server';
import type { Board3dCardInfoData } from './board3dCardsAdapter';

/**
 * Re-bind an open card-info prompt to the latest in-play lists/players so
 * effects like Fossil Ditto Transform / Brock's Ninetales Shapeshift update the pane in realtime.
 */
export function refreshInPlayCardInfoData(
  data: Board3dCardInfoData,
  players: Player[],
): Board3dCardInfoData {
  const cardId = data.card?.id;
  if (cardId == null) {
    return { ...data, players };
  }

  for (const player of players) {
    const lists: CardList[] = [player.active, ...(player.bench ?? [])];
    for (const list of lists) {
      if (!list) {
        continue;
      }
      const inCards = list.cards?.find((c: Card) => c.id === cardId);
      const tools = (list as PokemonCardList).tools;
      const inTools = tools?.find((c: Card) => c.id === cardId);
      const match = inCards ?? inTools;
      if (match) {
        return {
          ...data,
          card: match,
          cardList: list,
          players,
        };
      }
    }
  }

  return { ...data, players };
}
