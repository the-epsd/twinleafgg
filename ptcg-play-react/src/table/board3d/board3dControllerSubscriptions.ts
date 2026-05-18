import type { Subscription } from 'rxjs';
import type { BoardInteractionService, BasicEntranceAnimationEvent } from '../BoardInteractionService';

export type Board3dInteractionAnimationSink = {
  updateSelectionVisuals: () => void;
  playBoardAttackAnimation: (ev: BasicEntranceAnimationEvent) => void;
  playBoardBasicAnimation: (ev: BasicEntranceAnimationEvent) => void;
  playBoardEvolutionAnimation: (ev: BasicEntranceAnimationEvent) => void;
};

/** Selection + table animation streams wired for both legacy canvas and R3F controller init. */
export function subscribeBoard3dInteractionStreams(
  boardInteraction: BoardInteractionService,
  sink: Board3dInteractionAnimationSink,
): Subscription[] {
  return [
    boardInteraction.selectionMode$.subscribe(() => sink.updateSelectionVisuals()),
    boardInteraction.selectedTargets$.subscribe(() => sink.updateSelectionVisuals()),
    boardInteraction.attackAnimation$.subscribe((ev) => sink.playBoardAttackAnimation(ev)),
    boardInteraction.basicAnimation$.subscribe((ev) => sink.playBoardBasicAnimation(ev)),
    boardInteraction.evolutionAnimation$.subscribe((ev) => sink.playBoardEvolutionAnimation(ev)),
  ];
}
