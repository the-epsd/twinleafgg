import type { AbilityFocusPoint } from '../BoardInteractionService';

/**
 * CSS `matrix3d` that maps a w×h element (top-left origin, Y down) onto a screen-space quad.
 * Quad order must be BL, BR, TR, TL (matches {@link projectCardLowerFaceToScreenAnchor}).
 */
export function cssMatrix3dForQuad(
  width: number,
  height: number,
  bl: AbilityFocusPoint,
  br: AbilityFocusPoint,
  tr: AbilityFocusPoint,
  tl: AbilityFocusPoint,
): string | null {
  if (!(width > 1 && height > 1)) {
    return null;
  }

  // From unit square (0,0)-(1,1) with Y down: TL, TR, BR, BL → destination
  const from = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ] as const;
  const to = [
    [tl.x, tl.y],
    [tr.x, tr.y],
    [br.x, br.y],
    [bl.x, bl.y],
  ] as const;

  const h = solveHomography(from, to);
  if (!h) {
    return null;
  }

  // Scale unit-square homography by element size, then convert to CSS matrix3d
  // (column-major, Y already screen-down).
  const sx = 1 / width;
  const sy = 1 / height;
  const a = h[0][0] * sx;
  const b = h[1][0] * sx;
  const c = 0;
  const d = h[2][0] * sx;
  const e = h[0][1] * sy;
  const f = h[1][1] * sy;
  const g = 0;
  const hh = h[2][1] * sy;
  const i = 0;
  const j = 0;
  const k = 1;
  const l = 0;
  const m = h[0][2];
  const n = h[1][2];
  const o = 0;
  const p = h[2][2];

  return `matrix3d(${[a, b, c, d, e, f, g, hh, i, j, k, l, m, n, o, p].join(',')})`;
}

/** 3×3 homography mapping from[i] → to[i] (4 points). */
function solveHomography(
  from: ReadonlyArray<readonly [number, number]>,
  to: ReadonlyArray<readonly [number, number]>,
): number[][] | null {
  // Build 8×8 system for DLT (last h22 = 1).
  const A: number[][] = [];
  const b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = from[i];
    const [u, v] = to[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  }

  const h8 = solveLinearSystem(A, b);
  if (!h8) {
    return null;
  }

  return [
    [h8[0], h8[1], h8[2]],
    [h8[3], h8[4], h8[5]],
    [h8[6], h8[7], 1],
  ];
}

/** Gaussian elimination with partial pivoting for n×n. */
function solveLinearSystem(Ain: number[][], bin: number[]): number[] | null {
  const n = bin.length;
  const M = Ain.map((row, i) => [...row, bin[i]]);

  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) {
        pivot = r;
      }
    }
    if (Math.abs(M[pivot][col]) < 1e-10) {
      return null;
    }
    if (pivot !== col) {
      const tmp = M[col];
      M[col] = M[pivot];
      M[pivot] = tmp;
    }
    const div = M[col][col];
    for (let c = col; c <= n; c++) {
      M[col][c] /= div;
    }
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = M[r][col];
      for (let c = col; c <= n; c++) {
        M[r][c] -= f * M[col][c];
      }
    }
  }

  return M.map((row) => row[n]);
}
