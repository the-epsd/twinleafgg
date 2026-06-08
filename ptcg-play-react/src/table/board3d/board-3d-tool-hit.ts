import { Group, Mesh, MeshBasicMaterial, PlaneGeometry, type Object3D } from 'three';
import type { Board3dCard } from './board-3d-card';

/** Matches {@link getBoard3dCardBoxGeometry} width. */
export const BOARD3D_TOOL_CARD_WIDTH = 2.5;
/** Half of tool card height (box geometry Y extent before the mesh -90° X rotation). */
export const BOARD3D_TOOL_CARD_HALF_HEIGHT = 1.75;
/** Main Pokémon card bottom edge in host group space (tool sits under the card). */
export const BOARD3D_POKEMON_CARD_BOTTOM_Z = -BOARD3D_TOOL_CARD_HALF_HEIGHT;

export const BOARD3D_TOOL_HIT_TAB_UD = 'toolHitTab' as const;

/**
 * Tool cards render full-size under the host Pokémon but only a bottom strip should be
 * clickable (matching 2D clip-path). Disable body raycasts and add a small hit plane on
 * the protruding tab only.
 */
export function configureToolCardHitTarget(
  toolCard: Board3dCard,
  centerZInHost: number,
  scale = 1,
): Mesh | null {
  const tabMinZ = centerZInHost - BOARD3D_TOOL_CARD_HALF_HEIGHT;
  const tabMaxZ = BOARD3D_POKEMON_CARD_BOTTOM_Z;
  const tabHeight = tabMaxZ - tabMinZ;
  if (tabHeight <= 0.01) {
    return null;
  }

  const tabCenterZ = (tabMinZ + tabMaxZ) / 2;
  const localCenterZ = tabCenterZ - centerZInHost;

  const hitTab = new Mesh(
    new PlaneGeometry(BOARD3D_TOOL_CARD_WIDTH * scale, tabHeight),
    new MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
  );
  hitTab.rotation.x = -Math.PI / 2;
  hitTab.position.set(0, 0.002, localCenterZ);
  hitTab.renderOrder = 151;
  hitTab.userData[BOARD3D_TOOL_HIT_TAB_UD] = true;

  const group = toolCard.getGroup();
  group.add(hitTab);
  group.userData.toolHitTab = hitTab;

  disableToolCardBodyRaycast(group, hitTab);
  return hitTab;
}

/** Re-run after async holo layers attach so only the tab remains pickable. */
export function refreshToolCardHitTarget(toolCard: Board3dCard): void {
  const hitTab = toolCard.getGroup().userData.toolHitTab as Mesh | undefined;
  if (hitTab) {
    disableToolCardBodyRaycast(toolCard.getGroup(), hitTab);
  }
}

export function disposeToolCardHitTarget(group: Group): void {
  const hitTab = group.userData.toolHitTab as Mesh | undefined;
  if (!hitTab) {
    return;
  }
  group.remove(hitTab);
  hitTab.geometry.dispose();
  (hitTab.material as MeshBasicMaterial).dispose();
  delete group.userData.toolHitTab;
}

function disableToolCardBodyRaycast(group: Group, hitTab: Mesh): void {
  group.traverse((obj: Object3D) => {
    if (obj instanceof Mesh && obj !== hitTab) {
      obj.raycast = () => {};
    }
  });
}
