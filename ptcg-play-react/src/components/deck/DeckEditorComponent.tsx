import React, { useState, useEffect, useCallback, useRef } from 'react';
import { deckService, Deck, DeckResponse } from '../../services/deck.service';
import { Card, cardService } from '../../services/card.service';
import { cardImageService } from '../../services/card-image.service';
import './DeckEditorComponent.css';

interface DeckItem {
  card: Card;
  count: number;
}

const CARDS_PER_PAGE = 20;

export const DeckEditorComponent: React.FC<{ deckId: number }> = ({ deckId }) => {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [deckItems, setDeckItems] = useState<DeckItem[]>([]);
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [displayedCards, setDisplayedCards] = useState<Card[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const cardLibraryRef = useRef<HTMLDivElement>(null);

  const loadDeck = useCallback(async () => {
    try {
      setLoading(true);
      const response = await deckService.getDeck(deckId);
      if (!response.ok) {
        throw new Error('Failed to load deck');
      }
      setDeck(response.deck);

      // Count occurrences of each card in the deck
      const cardCounts: { [key: string]: number } = {};
      response.deck.cards.forEach(cardName => {
        cardCounts[cardName] = (cardCounts[cardName] || 0) + 1;
      });

      // Find cards in allCards by name
      const items: DeckItem[] = [];
      for (const cardName of Object.keys(cardCounts)) {
        const card = allCards.find(c => c.fullName === cardName);
        if (card) {
          items.push({ card, count: cardCounts[cardName] });
        } else {
          console.error(`Card not found: ${cardName}`);
        }
      }
      setDeckItems(items);
    } catch (err) {
      console.error('Error loading deck:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [deckId, allCards]);

  const loadCards = useCallback(async () => {
    try {
      setLoading(true);
      const response = await cardService.getAllCards();
      if (!response.ok) {
        throw new Error('Failed to load cards');
      }
      setAllCards(response.cards);
      setFilteredCards(response.cards);
      setDisplayedCards(response.cards.slice(0, CARDS_PER_PAGE));
      setHasMore(response.cards.length > CARDS_PER_PAGE);
    } catch (err) {
      console.error('Error loading cards:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await loadCards();
      if (deckId) {
        await loadDeck();
      }
    };
    loadData();
  }, [deckId, loadCards, loadDeck]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 200;

    if (bottom && hasMore && !loadingMore) {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const startIndex = nextPage * CARDS_PER_PAGE;
      const newCards = filteredCards.slice(startIndex, startIndex + CARDS_PER_PAGE);

      if (newCards.length > 0) {
        setDisplayedCards(prev => [...prev, ...newCards]);
        setCurrentPage(nextPage);
        setHasMore(filteredCards.length > startIndex + CARDS_PER_PAGE);
      }
      setLoadingMore(false);
    }
  }, [currentPage, hasMore, loadingMore, filteredCards]);

  const filterCards = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    if (!term) {
      setFilteredCards(allCards);
      setDisplayedCards(allCards.slice(0, CARDS_PER_PAGE));
      setHasMore(allCards.length > CARDS_PER_PAGE);
    } else {
      const filtered = allCards.filter(card =>
        card.fullName.toLowerCase().includes(term.toLowerCase()) ||
        card.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCards(filtered);
      setDisplayedCards(filtered.slice(0, CARDS_PER_PAGE));
      setHasMore(filtered.length > CARDS_PER_PAGE);
    }
  };

  const addCard = (card: Card) => {
    setDeckItems(prevItems => {
      const existingItem = prevItems.find(item => item.card.id === card.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.card.id === card.id ? { ...item, count: item.count + 1 } : item
        );
      } else {
        return [...prevItems, { card, count: 1 }];
      }
    });
  };

  const removeCard = (card: Card) => {
    setDeckItems(prevItems => {
      const existingItem = prevItems.find(item => item.card.id === card.id);
      if (existingItem) {
        if (existingItem.count > 1) {
          return prevItems.map(item =>
            item.card.id === card.id ? { ...item, count: item.count - 1 } : item
          );
        } else {
          return prevItems.filter(item => item.card.id !== card.id);
        }
      }
      return prevItems;
    });
  };

  const saveDeck = async () => {
    if (!deck) return;
    try {
      setLoading(true);
      const cards = deckItems.flatMap(item =>
        Array(item.count).fill(item.card.id)
      );
      const response = await deckService.saveDeck(deck.id, deck.name, cards);
      if (response.ok) {
        setDeck(response.deck);
      }
    } catch (err) {
      setError('Failed to save deck');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !deck) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!deck) return <div>Deck not found</div>;

  return (
    <div className="deck-editor">
      <div className="deck-info">
        <h2>{deck.name}</h2>
        <button onClick={saveDeck}>Save Deck</button>
      </div>

      <div className="deck-content">
        <div className="card-library" ref={cardLibraryRef} onScroll={handleScroll}>
          <input
            type="text"
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => filterCards(e.target.value)}
          />
          <div className="card-grid">
            {displayedCards.map((card, index) => (
              <div key={`card-${card.id}-${index}`} className="card-item" onClick={() => addCard(card)}>
                <img
                  src={cardImageService.getCardImage(card)}
                  alt={card.name}
                />
                <span>{card.name}</span>
              </div>
            ))}
          </div>
          {loadingMore && <div className="loading-more">Loading more cards...</div>}
          {!loadingMore && hasMore && <div className="loading-more">Scroll to load more</div>}
        </div>

        <div className="deck-view">
          <h3>Deck ({deckItems.reduce((sum, item) => sum + item.count, 0)} cards)</h3>
          <div className="deck-cards">
            {deckItems.map((item, index) => (
              <div
                key={`deck-${item.card.id}-${index}`}
                className="deck-card"
                onClick={() => removeCard(item.card)}
              >
                <div className="deck-card-image">
                  <img
                    src={cardImageService.getCardImage(item.card)}
                    alt={item.card.name}
                  />
                  <div className="deck-card-quantity">
                    {item.count}x
                  </div>
                </div>
                <span>{item.card.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 