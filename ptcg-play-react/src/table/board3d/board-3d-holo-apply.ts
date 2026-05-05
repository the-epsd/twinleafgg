import type { Card } from 'ptcg-server';
import { getHoloVariant } from '../../components/cards/holoVariant';
import { readClientSettingsSnapshot } from '../../settings/settingsStorage';
import type { Board3dCard } from './board-3d-card';
import type { Board3dAssetLoaderService } from './services/board-3d-asset-loader.service';

/**
 * Shows or clears the 3D holo layer (matches 2D CardFace rules + holo setting).
 * Call when the front texture is the real card scan, not a placeholder cardback.
 */
export async function apply3dCardHolo(
  assetLoader: Board3dAssetLoaderService,
  cardMesh: Board3dCard,
  card: Card,
  isFaceDownOrPlaceholder: boolean
): Promise<void> {
  if (isFaceDownOrPlaceholder) {
    cardMesh.setHolo(null);
    return;
  }
  const { holoEnabled } = readClientSettingsSnapshot();
  const v = getHoloVariant(card, holoEnabled);
  if (!v) {
    cardMesh.setHolo(null);
    return;
  }
  const mask = await assetLoader.load2dHoloMaskTexture(v);
  cardMesh.setHolo(mask);
}
