import { memo, useSyncExternalStore } from 'react';
import type { Board3dStateSyncService } from './services/board-3d-state-sync.service';
import { Board3dCardMesh } from './Board3dCardMesh';

export type Board3dBoardCardsLayerProps = {
  stateSync: Board3dStateSyncService;
};

export const Board3dBoardCardsLayer = memo(function Board3dBoardCardsLayer({
  stateSync,
}: Board3dBoardCardsLayerProps) {
  const model = useSyncExternalStore(
    (cb) => stateSync.subscribeSceneModel(cb),
    () => stateSync.getSceneModelSnapshot(),
    () => stateSync.getSceneModelSnapshot(),
  );

  void model.version;

  return (
    <group>
      {model.boardCards.map((entry) => (
        <Board3dCardMesh
          key={`${entry.meshId}:${entry.bridgeRef.getGroup().uuid}`}
          card={entry.bridgeRef}
        />
      ))}
    </group>
  );
});
