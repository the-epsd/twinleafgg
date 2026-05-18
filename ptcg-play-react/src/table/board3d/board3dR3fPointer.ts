import type { ThreeEvent } from '@react-three/fiber';

/** Forward an R3F pointer event to code expecting a {@link MouseEvent} (same `clientX` / `clientY`). */
export function r3fPointerEventAsMouse(ev: ThreeEvent<PointerEvent>): MouseEvent {
  return ev.nativeEvent as unknown as MouseEvent;
}
