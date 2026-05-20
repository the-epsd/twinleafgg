import {
  placeSetupActive,
  placeSetupBench,
  removeSetupPlacement,
  setupPlacedIndexes,
} from './setupSelectionModel';

class SetupSelectionStore {
  activeIndex = $state<number | null>(null);
  benchIndexes = $state<number[]>([]);

  get placedIndexes() {
    return setupPlacedIndexes(this.snapshot);
  }

  get snapshot() {
    return {
      activeIndex: this.activeIndex,
      benchIndexes: this.benchIndexes,
    };
  }

  reset() {
    this.activeIndex = null;
    this.benchIndexes = [];
  }

  placeActive(handIndex: number) {
    this.apply(placeSetupActive(this.snapshot, handIndex));
  }

  placeBench(handIndex: number) {
    this.apply(placeSetupBench(this.snapshot, handIndex));
  }

  remove(handIndex: number) {
    this.apply(removeSetupPlacement(this.snapshot, handIndex));
  }

  private apply(state: { activeIndex: number | null; benchIndexes: number[] }) {
    this.activeIndex = state.activeIndex;
    this.benchIndexes = state.benchIndexes;
  }
}

export const setupSelectionStore = new SetupSelectionStore();
