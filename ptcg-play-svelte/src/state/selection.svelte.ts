import type { PokemonSlotView } from '../lib/game/types';

export type HandSelection = {
  playerIndex: number;
  handIndex: number;
};

class SelectionStore {
  selectedHand = $state<HandSelection | null>(null);
  draggingHand = $state<HandSelection | null>(null);
  focusedSlot = $state<PokemonSlotView | null>(null);

  get snapshot() {
    return {
      selectedHand: this.selectedHand,
      draggingHand: this.draggingHand,
      focusedSlot: this.focusedSlot,
    };
  }

  setSelectedHand(selection: HandSelection | null) {
    this.selectedHand = selection;
  }

  toggleSelectedHand(selection: HandSelection) {
    this.selectedHand =
      this.selectedHand?.playerIndex === selection.playerIndex && this.selectedHand.handIndex === selection.handIndex
        ? null
        : selection;
  }

  startDragging(selection: HandSelection) {
    this.selectedHand = selection;
    this.draggingHand = selection;
    this.focusedSlot = null;
  }

  clearDragging() {
    this.draggingHand = null;
  }

  focusSlot(slot: PokemonSlotView | null) {
    this.focusedSlot = slot;
    if (slot) {
      this.selectedHand = null;
    }
  }

  clearFocus() {
    this.focusedSlot = null;
  }

  clearHandAndFocus() {
    this.selectedHand = null;
    this.draggingHand = null;
    this.focusedSlot = null;
  }

  clearAll() {
    this.clearHandAndFocus();
  }
}

export const selectionStore = new SelectionStore();
