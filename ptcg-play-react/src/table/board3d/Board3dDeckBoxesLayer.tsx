import { Suspense } from 'react';
import type { Player } from 'ptcg-server';
import { ZONE_POSITIONS } from './board-3d-zone-positions';
import type { Board3dCardsAdapter } from './board3dCardsAdapter';
import { DeckBoxModel } from '../../pages/deck-box-preview/DeckBoxModel';

const BOTTOM_YAW = Math.PI / 4 + Math.PI / 2.5; // 135° — front toward bottom camera
const TOP_YAW = Math.PI + Math.PI / 4;

type Board3dDeckBoxesLayerProps = {
  bottomPlayer?: Player;
  topPlayer?: Player;
  cardsAdapter: Board3dCardsAdapter;
};

function playerDeckBoxUrl(player: Player | undefined, cardsAdapter: Board3dCardsAdapter): string | undefined {
  if (!player) return undefined;
  const path = (player as { deckBoxImagePath?: string }).deckBoxImagePath;
  return cardsAdapter.getDeckBoxUrl(path);
}

function DeckBoxAt({
  url,
  position,
  rotationY,
}: {
  url: string;
  position: [number, number, number];
  rotationY: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <DeckBoxModel key={url} textureUrl={url} scale={1} />
    </group>
  );
}

/**
 * Decorative standing deck boxes beside each player's prize zone (~45° yaw), Live-style.
 */
export function Board3dDeckBoxesLayer({
  bottomPlayer,
  topPlayer,
  cardsAdapter,
}: Board3dDeckBoxesLayerProps) {
  const bottomUrl = playerDeckBoxUrl(bottomPlayer, cardsAdapter);
  const topUrl = playerDeckBoxUrl(topPlayer, cardsAdapter);
  const bottomPos = ZONE_POSITIONS.bottomPlayer.deckBox;
  const topPos = ZONE_POSITIONS.topPlayer.deckBox;

  if (!bottomUrl && !topUrl) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      {bottomUrl ? (
        <DeckBoxAt
          url={bottomUrl}
          position={[bottomPos.x, bottomPos.y, bottomPos.z]}
          rotationY={BOTTOM_YAW}
        />
      ) : null}
      {topUrl ? (
        <DeckBoxAt
          url={topUrl}
          position={[topPos.x, topPos.y, topPos.z]}
          rotationY={TOP_YAW}
        />
      ) : null}
    </Suspense>
  );
}
