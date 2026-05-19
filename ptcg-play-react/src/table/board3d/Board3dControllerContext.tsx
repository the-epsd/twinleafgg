import { createContext, useContext } from 'react';
import type { MutableRefObject } from 'react';
import type { Board3dController } from './board3dController';

const defaultRef: MutableRefObject<Board3dController | null> = { current: null };

export const Board3dControllerRefContext =
  createContext<MutableRefObject<Board3dController | null>>(defaultRef);

export function useBoard3dControllerRef(): MutableRefObject<Board3dController | null> {
  return useContext(Board3dControllerRefContext);
}
