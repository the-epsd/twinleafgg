import React, { useState, useEffect } from 'react';
import { deckService, Deck, DeckResponse } from '../../services/deck.service';
import { Card, cardService } from '../../services/card.service';
import { CardImageService } from '../../services/card-image.service';
import './DeckEditorComponent.css';

interface DeckItem {
  card: Card;
  count: number;
}

const cardImageService = CardImageService.getInstance();

export const DeckEditorComponent: React.FC<{ deckId: number }> = ({ deckId }) => {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [deckItems, setDeckItems] = useState<DeckItem[]>([]);
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load all cards first
        const cardsResponse = await cardService.getAllCards();
        if (!cardsResponse.ok) {
          throw new Error('Failed to load cards');
        }
        setAllCards(cardsResponse.cards);
        setFilteredCards(cardsResponse.cards);

        // Then load deck
        const deckResponse = await deckService.getDeck(deckId);
        if (!deckResponse.ok) {
          throw new Error('Failed to load deck');
        }
        setDeck(deckResponse.deck);

        // Process deck items
        const items: DeckItem[] = [];
        const cardCounts: { [key: string]: number } = {};
        deckResponse.deck.cards.forEach(cardName => {
          cardCounts[cardName] = (cardCounts[cardName] || 0) + 1;
        });

        // Find cards in allCards by fullName
        for (const cardName of Object.keys(cardCounts)) {
          const card = cardsResponse.cards.find(c => c.fullName === cardName);
          if (card) {
            items.push({ card, count: cardCounts[cardName] });
          } else {
            console.error(`Card not found: ${cardName}`);
          }
        }

        setDeckItems(items);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [deckId]);

  const filterCards = (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredCards(allCards);
      return;
    }
    const filtered = allCards.filter(card =>
      card.fullName.toLowerCase().includes(term.toLowerCase()) ||
      card.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCards(filtered);
  };

  const addCard = (card: Card) => {
    const existingItem = deckItems.find(item => item.card.id === card.id);
    if (existingItem) {
      setDeckItems(deckItems.map(item =>
        item.card.id === card.id ? { ...item, count: item.count + 1 } : item
      ));
    } else {
      setDeckItems([...deckItems, { card, count: 1 }]);
    }
  };

  const removeCard = (card: Card) => {
    const existingItem = deckItems.find(item => item.card.id === card.id);
    if (existingItem) {
      if (existingItem.count > 1) {
        setDeckItems(deckItems.map(item =>
          item.card.id === card.id ? { ...item, count: item.count - 1 } : item
        ));
      } else {
        setDeckItems(deckItems.filter(item => item.card.id !== card.id));
      }
    }
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!deck) return <div>Deck not found</div>;

  return (
    <div className="deck-editor">
      <div className="deck-info">
        <h2>{deck.name}</h2>
        <button onClick={saveDeck}>Save Deck</button>
      </div>

      <div className="deck-content">
        <div className="card-library">
          <input
            type="text"
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => filterCards(e.target.value)}
          />
          <div className="card-grid">
            {filteredCards.map(card => (
              <div key={card.id} className="card-item" onClick={() => addCard(card)}>
                <img
                  src={cardImageService.getCardImage(card)}
                  alt={card.name}
                />
                <span>{card.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="deck-view">
          <h3>Deck ({deckItems.reduce((sum, item) => sum + item.count, 0)} cards)</h3>
          <div className="deck-cards">
            {deckItems.map((item, index) => (
              <div key={`${item.card.id}-${index}`} className="deck-card">
                <img
                  src={cardImageService.getCardImage(item.card)}
                  alt={item.card.name}
                />
                <span>{item.count}x {item.card.name}</span>
                <button onClick={() => removeCard(item.card)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 