import { useEffect } from 'react';
import { useBoard3dControllerRef } from './Board3dControllerContext';

function isEditableTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) {
    return false;
  }
  const tag = el.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
    return true;
  }
  return el.isContentEditable;
}

/** Dev-only visual: press S to run deck shuffle preview on all deck anchors. */
export function Board3dShufflePreviewKey() {
  const ctrlRef = useBoard3dControllerRef();

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.repeat) {
        return;
      }
      if (e.key !== 's' && e.key !== 'S') {
        return;
      }
      if (isEditableTarget(e.target)) {
        return;
      }
      ctrlRef.current?.triggerDeckShufflePreview();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ctrlRef]);

  return null;
}
