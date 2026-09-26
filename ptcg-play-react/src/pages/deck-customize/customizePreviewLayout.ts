/** Shared Preview All layout — tweak via Edit Layout on Customize, then paste JSON back. */

export type Vec3 = [number, number, number];

export type PropTransform = {
  position: Vec3;
  /** Euler XYZ in radians */
  rotation: Vec3;
  /** Uniform scale */
  scale: number;
};

export type CameraLayout = {
  position: Vec3;
  target: Vec3;
  fov: number;
};

export type CustomizePreviewLayout = {
  camera: CameraLayout;
  box: PropTransform;
  sleeve: PropTransform;
  coin: PropTransform;
};

export const DEFAULT_CUSTOMIZE_PREVIEW_LAYOUT: CustomizePreviewLayout = {
  camera: {
    position: [-2.2117, 2.3996, 9.1973],
    target: [0, -0.1, 0],
    fov: 35,
  },
  box: {
    position: [-0.6653, 0.3048, -0.0718],
    rotation: [-3.1416, 1.114, -3.1416],
    scale: 0.7447,
  },
  sleeve: {
    position: [0.9784, -0.0258, 0.7879],
    rotation: [-0.0293, -0.6134, -0.0441],
    scale: 0.8247,
  },
  coin: {
    position: [-1.8728, -0.4321, 1.5304],
    rotation: [-0.2103, 0.1367, -0.0936],
    scale: 0.5623,
  },
};

export type LayoutPropId = 'box' | 'sleeve' | 'coin';

export function roundLayout(layout: CustomizePreviewLayout, digits = 4): CustomizePreviewLayout {
  const r = (n: number) => Number(n.toFixed(digits));
  const rv = (v: Vec3): Vec3 => [r(v[0]), r(v[1]), r(v[2])];
  const rp = (p: PropTransform): PropTransform => ({
    position: rv(p.position),
    rotation: rv(p.rotation),
    scale: r(p.scale),
  });
  return {
    camera: {
      position: rv(layout.camera.position),
      target: rv(layout.camera.target),
      fov: r(layout.camera.fov),
    },
    box: rp(layout.box),
    sleeve: rp(layout.sleeve),
    coin: rp(layout.coin),
  };
}

export function layoutToClipboardJson(layout: CustomizePreviewLayout): string {
  return JSON.stringify(roundLayout(layout), null, 2);
}

export function parseLayoutJson(raw: string): CustomizePreviewLayout | null {
  try {
    const parsed = JSON.parse(raw) as Partial<CustomizePreviewLayout>;
    if (!parsed?.camera || !parsed?.box || !parsed?.sleeve || !parsed?.coin) return null;
    return {
      ...DEFAULT_CUSTOMIZE_PREVIEW_LAYOUT,
      ...parsed,
      camera: { ...DEFAULT_CUSTOMIZE_PREVIEW_LAYOUT.camera, ...parsed.camera },
      box: { ...DEFAULT_CUSTOMIZE_PREVIEW_LAYOUT.box, ...parsed.box },
      sleeve: { ...DEFAULT_CUSTOMIZE_PREVIEW_LAYOUT.sleeve, ...parsed.sleeve },
      coin: { ...DEFAULT_CUSTOMIZE_PREVIEW_LAYOUT.coin, ...parsed.coin },
    };
  } catch {
    return null;
  }
}
