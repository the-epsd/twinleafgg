import type { Object3D } from 'three';

/** True when this object is under a card group currently in 3D inspect pose. */
export function isUnderInspectingCard(obj: Object3D | null | undefined): boolean {
  let o: Object3D | null | undefined = obj;
  while (o) {
    if (o.userData?.inspecting === true) {
      return true;
    }
    o = o.parent;
  }
  return false;
}
