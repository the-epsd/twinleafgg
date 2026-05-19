import gsap from 'gsap';
import type { Euler, Group, Vector3 } from 'three';
import { Board3dStackService } from './services/board-3d-stack.service';
import type { Board3dCard } from './board-3d-card';

export type PlayDeckShufflePreviewOpts = {
  stackService: Board3dStackService;
  getCardById: (id: string) => Board3dCard | undefined;
  stackId: string;
};

const UD_TL = 'deckShufflePreviewTl';
const UD_RESTORE = 'deckShufflePreviewRestorePack';

/** Total preview length (seconds). */
const SHUFFLE_DURATION = 1.48;

type BulkTransformCapture = {
  pos: Vector3;
  rot: Euler;
  scale: Vector3;
};

type DeckShuffleRestorePack = {
  topPos: Vector3;
  topRot: Euler;
  topScale: Vector3;
  bulk: BulkTransformCapture[];
};

function captureBulkTransforms(groups: Group[]): BulkTransformCapture[] {
  return groups.map((g) => ({
    pos: g.position.clone(),
    rot: g.rotation.clone(),
    scale: g.scale.clone(),
  }));
}

function restoreBulkTransforms(groups: Group[], caps: BulkTransformCapture[]): void {
  const n = Math.min(groups.length, caps.length);
  for (let i = 0; i < n; i++) {
    groups[i].position.copy(caps[i].pos);
    groups[i].rotation.copy(caps[i].rot);
    groups[i].scale.copy(caps[i].scale);
  }
}

function restoreTopAndBulk(topGroup: Group, pack: DeckShuffleRestorePack, bulkGroups: Group[]): void {
  topGroup.position.copy(pack.topPos);
  topGroup.rotation.copy(pack.topRot);
  topGroup.scale.copy(pack.topScale);
  restoreBulkTransforms(bulkGroups, pack.bulk);
}

function captureDeckShuffleRestorePack(topGroup: Group, bulkGroups: Group[]): DeckShuffleRestorePack {
  return {
    topPos: topGroup.position.clone(),
    topRot: topGroup.rotation.clone(),
    topScale: topGroup.scale.clone(),
    bulk: captureBulkTransforms(bulkGroups),
  };
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Riffle-style shuffle (visual only): two halves fan apart, lift, quick mid-air flutter, square up.
 * Uses pile split by index (bottom vs top half); `_top` follows the upper pile cap.
 */
function riffleShuffleDeltas(
  u: number,
  cardIndex: number,
  bulkLen: number,
): { dx: number; dy: number; dz: number; rz: number } {
  if (bulkLen <= 0) {
    const w = Math.sin(u * Math.PI * 3.2) * 0.026;
    return {
      dx: w,
      dy: smoothstep(0.15, 0.82, u) * 0.042 - smoothstep(0, 0.12, u) * 0.014,
      dz: 0,
      rz: w * 2,
    };
  }

  const mid = Math.ceil(bulkLen / 2);
  const side = cardIndex < mid ? -1 : 1;

  const splitOpen = smoothstep(0, 0.13, u);
  const splitClose = smoothstep(0.66, 1, u);
  const split = splitOpen * (1 - splitClose);

  const liftOpen = smoothstep(0.06, 0.2, u);
  const liftClose = smoothstep(0.48, 0.68, u);
  const lift = liftOpen * (1 - liftClose);

  const riffleCore = smoothstep(0.16, 0.52, u);
  const riffleTail = 1 - smoothstep(0.46, 0.62, u);
  const riffle = riffleCore * riffleTail;

  const flutter = Math.sin(u * Math.PI * 28 + cardIndex * 0.82) * 0.026 * riffle;
  const weave = Math.sin(u * Math.PI * 14 + cardIndex * 0.38) * 0.013 * riffle * side;

  const dx = side * 0.5 * split + weave;
  const dy = 0.135 * lift - 0.036 * split * (1 - liftOpen * 0.5);
  const dz = flutter + Math.sin(cardIndex * 0.55 + u * 17) * 0.015 * riffle;
  const rz = side * (-0.16 * split + 0.068 * lift) + flutter * 11.5;

  return { dx, dy, dz, rz };
}

/**
 * Deck shuffle preview: riffle — halves separate, lift, flutter together, square and settle.
 */
export function playDeckShufflePreview(opts: PlayDeckShufflePreviewOpts): gsap.core.Timeline | null {
  const anchor = opts.stackService.getDeckAnchor(opts.stackId);
  const bulkGroups = opts.stackService.getDeckBulkGroups(opts.stackId);
  const topId = `${opts.stackId}_top`;
  const topBridge = opts.getCardById(topId);
  const topGroup = topBridge?.getGroup();

  if (!anchor || !topGroup) {
    return null;
  }

  const prevTl = anchor.userData[UD_TL] as gsap.core.Timeline | undefined;
  if (prevTl) {
    prevTl.kill();
  }

  const staleRestore = anchor.userData[UD_RESTORE] as DeckShuffleRestorePack | undefined;
  if (staleRestore) {
    restoreTopAndBulk(topGroup, staleRestore, bulkGroups);
    delete anchor.userData[UD_RESTORE];
  }

  gsap.killTweensOf(topGroup.position);
  gsap.killTweensOf(topGroup.rotation);
  gsap.killTweensOf(topGroup.scale);
  for (const g of bulkGroups) {
    gsap.killTweensOf(g.position);
    gsap.killTweensOf(g.rotation);
    gsap.killTweensOf(g.scale);
  }

  const restorePack = captureDeckShuffleRestorePack(topGroup, bulkGroups);
  anchor.userData[UD_RESTORE] = restorePack;

  const baseTopPos = restorePack.topPos;
  const baseTopRotZ = restorePack.topRot.z;

  const bulkLen = bulkGroups.length;
  const inc = Board3dStackService.STACK_HEIGHT_INCREMENT;
  /** Extra lift so the face card clears the bulk cap during the riffle. */
  const topExtraY = bulkLen > 0 ? inc * 3.1 : 0;

  const prog = { u: 0 };

  const apply = (): void => {
    const u = prog.u;

    for (let i = 0; i < bulkLen; i++) {
      const g = bulkGroups[i];
      const base = restorePack.bulk[i];
      const d = riffleShuffleDeltas(u, i, bulkLen);
      g.position.set(base.pos.x + d.dx, base.pos.y + d.dy, base.pos.z + d.dz);
      g.rotation.copy(base.rot);
      g.rotation.z = base.rot.z + d.rz;
    }

    const td = bulkLen > 0 ? riffleShuffleDeltas(u, bulkLen - 1, bulkLen) : riffleShuffleDeltas(u, 0, 0);
    topGroup.position.set(
      baseTopPos.x + td.dx * 0.94,
      baseTopPos.y + td.dy + topExtraY * smoothstep(0.05, 0.28, u) * (1 - smoothstep(0.52, 0.82, u)),
      baseTopPos.z + td.dz * 0.88,
    );
    topGroup.rotation.z = baseTopRotZ + td.rz * 0.93;
  };

  apply();

  const tl = gsap.timeline({
    onComplete: () => {
      restoreTopAndBulk(topGroup, restorePack, bulkGroups);
      delete anchor.userData[UD_TL];
      delete anchor.userData[UD_RESTORE];
    },
  });

  anchor.userData[UD_TL] = tl;

  tl.to(prog, {
    u: 1,
    duration: SHUFFLE_DURATION,
    ease: 'power1.inOut',
    onUpdate: apply,
  });

  return tl;
}
