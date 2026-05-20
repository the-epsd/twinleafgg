import type { AttachAssignment } from '../lib/game/preview';
import type { CardTarget, CardView } from '../lib/game/types';
import {
  assignAttachTarget,
  pruneAttachAssignments,
  sameAttachAssignments,
  toggleBoardTarget,
} from './promptSelectionModel';

type IndexedCardView = CardView & {
  index?: number;
};

class PromptSelectionStore {
  selectedBoardTargets = $state<CardTarget[]>([]);
  activeAttachEnergyIndex = $state<number | null>(null);
  attachAssignments = $state<AttachAssignment[]>([]);

  resetBoardTargets() {
    this.selectedBoardTargets = [];
  }

  toggleBoardTarget(target: CardTarget, maxSelections: number) {
    this.selectedBoardTargets = toggleBoardTarget(this.selectedBoardTargets, target, maxSelections);
  }

  setBoardTargets(targets: CardTarget[]) {
    this.selectedBoardTargets = targets;
  }

  toggleAttachEnergy(index: number | null) {
    this.activeAttachEnergyIndex = this.activeAttachEnergyIndex === index ? null : index;
  }

  clearUnavailableAttachEnergy(isAvailable: (energyIndex: number) => boolean) {
    this.activeAttachEnergyIndex =
      this.activeAttachEnergyIndex !== null && isAvailable(this.activeAttachEnergyIndex)
        ? this.activeAttachEnergyIndex
        : null;
  }

  pruneAttachAssignments(cards: IndexedCardView[], targets: CardTarget[], maxAssignments: number) {
    const nextAssignments = pruneAttachAssignments(this.attachAssignments, cards, targets, maxAssignments);
    if (!sameAttachAssignments(this.attachAssignments, nextAssignments)) {
      this.attachAssignments = nextAssignments;
    }
  }

  assignAttachTarget(target: CardTarget, maxAssignments: number) {
    if (this.activeAttachEnergyIndex === null) {
      return;
    }
    this.attachAssignments = assignAttachTarget(this.attachAssignments, this.activeAttachEnergyIndex, target, maxAssignments);
    this.activeAttachEnergyIndex = null;
  }

  removeAttachAssignment(index: number) {
    this.attachAssignments = this.attachAssignments.filter((assignment) => assignment.energyIndex !== index);
    if (this.activeAttachEnergyIndex === index) {
      this.activeAttachEnergyIndex = null;
    }
  }

  resetAttachAssignments() {
    this.attachAssignments = [];
    this.activeAttachEnergyIndex = null;
  }

  reset() {
    this.resetBoardTargets();
    this.resetAttachAssignments();
  }
}

export const promptSelectionStore = new PromptSelectionStore();
