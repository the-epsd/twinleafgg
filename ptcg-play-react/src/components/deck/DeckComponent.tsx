import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deckService, Deck, DeckResponse } from '../../services/deck.service';
import { Card } from '../../services/card.service';
import { CardImageService } from '../../services/card-image.service';
import './DeckComponent.css';

interface DeckItem {
  card: Card;
  count: number;
}

const cardImageService = CardImageService.getInstance();

export const DeckComponent: React.FC = () => {
  const navigate = useNavigate();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [deckItems, setDeckItems] = useState<DeckItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      setLoading(true);
      const response = await deckService.getList();
      if (response.ok) {
        setDecks(response.decks);
      }
    } catch (err) {
      setError('Failed to load decks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeck = async (name: string) => {
    try {
      setLoading(true);
      const response = await deckService.createDeck(name);
      if (response.ok) {
        setDecks([...decks, response.deck]);
        setSelectedDeck(response.deck);
        navigate(`/decks/edit/${response.deck.id}`);
      }
    } catch (err) {
      setError('Failed to create deck');
    } finally {
      setLoading(false);
    }
  };

  const handleEditDeck = (deckId: number) => {
    navigate(`/decks/edit/${deckId}`);
  };

  const handleSelectDeck = async (deckId: number) => {
    try {
      setLoading(true);
      const response = await deckService.getDeck(deckId);
      if (response.ok) {
        setSelectedDeck(response.deck);
        // Load deck items from the deck's cards array
        const items: DeckItem[] = [];
        const cardCounts: { [key: string]: number } = {};
        response.deck.cards.forEach(cardId => {
          cardCounts[cardId] = (cardCounts[cardId] || 0) + 1;
        });
        // TODO: Load card details for each unique card ID
        setDeckItems(items);
      }
    } catch (err) {
      setError('Failed to load deck');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDeck = async (deckId: number) => {
    try {
      setLoading(true);
      await deckService.deleteDeck(deckId);
      setDecks(decks.filter(deck => deck.id !== deckId));
      if (selectedDeck?.id === deckId) {
        setSelectedDeck(null);
      }
    } catch (err) {
      setError('Failed to delete deck');
    } finally {
      setLoading(false);
    }
  };

  const handleRenameDeck = async (deckId: number, newName: string) => {
    try {
      setLoading(true);
      await deckService.rename(deckId, newName);
      setDecks(decks.map(deck =>
        deck.id === deckId ? { ...deck, name: newName } : deck
      ));
      if (selectedDeck?.id === deckId) {
        setSelectedDeck({ ...selectedDeck, name: newName });
      }
    } catch (err) {
      setError('Failed to rename deck');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="deck-container">
      <div className="deck-header">
        <h2>My Decks</h2>
        <button onClick={() => handleCreateDeck('New Deck')}>Create Deck</button>
      </div>
      <div className="deck-grid">
        {decks.map(deck => (
          <div key={deck.id} className="deck-card">
            <div className="deck-card-header">
              <h3>{deck.name}</h3>
              <div className="deck-card-actions">
                <button onClick={() => handleEditDeck(deck.id)}>Edit</button>
                <button onClick={() => handleDeleteDeck(deck.id)}>Delete</button>
              </div>
            </div>
            <div className="deck-card-content">
              <div className="deck-card-count">{deck.cards.length} cards</div>
              {deck.format && (
                <div className="deck-card-format">
                  {deck.format.map(f => f.name).join(', ')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeckComponent; 