import { SAMPLE_DECK } from '../lib/game/deckImport';
import { parseLocalGameDecks } from './deckImportModel';

class DeckImportStore {
  deck1Text = $state(SAMPLE_DECK);
  deck2Text = $state(SAMPLE_DECK);

  parseLocalGameDecks() {
    return parseLocalGameDecks(this.deck1Text, this.deck2Text);
  }

  reset() {
    this.deck1Text = SAMPLE_DECK;
    this.deck2Text = SAMPLE_DECK;
  }
}

export const deckImportStore = new DeckImportStore();
