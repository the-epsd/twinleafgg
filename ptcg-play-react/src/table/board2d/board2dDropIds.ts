import { PlayerType, SlotType, type CardTarget } from 'ptcg-server';

export type Board2dDropKind =
  | 'active'
  | 'bench'
  | 'stadium'
  | 'board'
  | 'supporter'
  | 'hand';

export function board2dHandDragId(index: number): string {
  return `hand-${index}`;
}

export function board2dSlotDropId(
  player: PlayerType,
  slot: SlotType,
  index = 0,
): string {
  return `slot-${player}-${slot}-${index}`;
}

export function board2dBoardDropId(): string {
  return 'slot-board';
}

export function parseBoard2dDropId(id: string): CardTarget | null {
  if (id === 'slot-board') {
    return { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 };
  }
  const m = /^slot-(\d+)-(\d+)-(\d+)$/.exec(id);
  if (!m) {
    return null;
  }
  return {
    player: Number(m[1]) as PlayerType,
    slot: Number(m[2]) as SlotType,
    index: Number(m[3]),
  };
}

export function parseBoard2dHandDragId(id: string): number | null {
  const m = /^hand-(\d+)$/.exec(id);
  return m ? Number(m[1]) : null;
}

export function board2dActiveBenchDragId(
  player: PlayerType,
  slot: SlotType,
  index: number,
): string {
  return `board-card-${player}-${slot}-${index}`;
}

export function parseBoard2dActiveBenchDragId(
  id: string,
): { player: PlayerType; slot: SlotType; index: number } | null {
  const m = /^board-card-(\d+)-(\d+)-(\d+)$/.exec(id);
  if (!m) {
    return null;
  }
  return {
    player: Number(m[1]) as PlayerType,
    slot: Number(m[2]) as SlotType,
    index: Number(m[3]),
  };
}
