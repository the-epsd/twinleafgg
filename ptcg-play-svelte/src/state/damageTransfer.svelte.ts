import { sameTarget } from '../lib/game/targets';
import type { CardTarget } from '../lib/game/types';

export type DamageTransferPair = {
  from: CardTarget;
  to: CardTarget;
};

class DamageTransferStore {
  source = $state<CardTarget | null>(null);
  pairs = $state<DamageTransferPair[]>([]);

  get destination(): CardTarget | null {
    return this.pairs[0]?.to ?? null;
  }

  get counterCount(): number {
    return this.pairs.length;
  }

  selectSource(target: CardTarget) {
    if (this.source) {
      return;
    }
    this.source = target;
  }

  addCounter(destination: CardTarget, maxCounters: number) {
    if (!this.source || this.pairs.length >= maxCounters) {
      return;
    }
    this.pairs = [...this.pairs, { from: this.source, to: destination }];
  }

  undoLast() {
    if (this.pairs.length === 0) {
      return;
    }
    this.pairs = this.pairs.slice(0, -1);
  }

  reset() {
    this.source = null;
    this.pairs = [];
  }

  isSource(target: CardTarget): boolean {
    return !!this.source && sameTarget(this.source, target);
  }

  isDestination(target: CardTarget): boolean {
    const dest = this.destination;
    return !!dest && sameTarget(dest, target);
  }

  result(): DamageTransferPair[] {
    return [...this.pairs];
  }
}

export const damageTransferStore = new DamageTransferStore();
