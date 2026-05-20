import { useEffect, useLayoutEffect, useMemo } from 'react';
import {
  BufferGeometry,
  DoubleSide,
  Euler,
  Matrix4,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Quaternion,
  SRGBColorSpace,
  Vector3,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Select } from '@react-three/postprocessing';
import { useTexture } from '@react-three/drei';
import { ZONE_POSITIONS } from './board-3d-zone-positions';
import {
  BOARD_3D_BENCH_OUTLINE_COLOR,
  BOARD_3D_BENCH_OUTLINE_THICKNESS,
  BOARD_3D_CENTER_EMBLEM_SIZE,
  BOARD_3D_CENTER_EMBLEM_Y,
  BOARD_3D_GRID_Y,
} from './board3d-constants';
import { publicAssetUrl } from '../../utils/publicAssetUrl';

const BOARD_W = 70;
const BOARD_H = 50;
const BOARD_CENTER_Z = 12;

function buildMergedBoardGridGeometry(): BufferGeometry {
  const t = BOARD_3D_BENCH_OUTLINE_THICKNESS;
  const y = BOARD_3D_GRID_Y;
  const minX = -BOARD_W / 2;
  const maxX = BOARD_W / 2;
  const minZ = BOARD_CENTER_Z - BOARD_H / 2;
  const maxZ = BOARD_CENTER_Z + BOARD_H / 2;

  const m = new Matrix4();
  const q = new Quaternion().setFromEuler(new Euler(-Math.PI / 2, 0, 0));
  const s = new Vector3(1, 1, 1);
  const v = new Vector3();
  const parts: BufferGeometry[] = [];

  for (let x = Math.ceil(minX) + 1; x <= Math.floor(maxX) - 1; x++) {
    const g = new PlaneGeometry(t, BOARD_H);
    v.set(x, y, BOARD_CENTER_Z);
    m.compose(v, q, s);
    g.applyMatrix4(m);
    parts.push(g);
  }
  for (let z = Math.ceil(minZ) + 1; z <= Math.floor(maxZ) - 1; z++) {
    const g = new PlaneGeometry(BOARD_W, t);
    v.set(0, y, z);
    m.compose(v, q, s);
    g.applyMatrix4(m);
    parts.push(g);
  }

  const merged = mergeGeometries(parts);
  for (const p of parts) {
    p.dispose();
  }
  return merged;
}

export type Board3dStaticSceneProps = {
  /** When true, emblem is wrapped in postprocessing {@link Select} for selective bloom. */
  bloomActive?: boolean;
};

export function Board3dStaticScene({ bloomActive = false }: Board3dStaticSceneProps) {
  const emblemPath = publicAssetUrl('assets/twinleaf-board-center.png');
  const centerTex = useTexture(emblemPath);

  useLayoutEffect(() => {
    centerTex.colorSpace = SRGBColorSpace;
  }, [centerTex]);

  const boardMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: 0x404040,
        roughness: 1,
        metalness: 0,
      }),
    []
  );

  const emblemMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        map: centerTex,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        side: DoubleSide,
        /** Skip renderer tone mapping so PNG colors match the source art. */
        toneMapped: false,
      }),
    [centerTex]
  );

  const gridMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        color: BOARD_3D_BENCH_OUTLINE_COLOR,
        transparent: true,
        opacity: 0.1,
        side: DoubleSide,
        depthTest: true,
      }),
    []
  );

  const gridMergedGeometry = useMemo(() => buildMergedBoardGridGeometry(), []);
  const boardPlaneGeometry = useMemo(() => new PlaneGeometry(BOARD_W, BOARD_H), []);
  const emblemPlaneGeometry = useMemo(
    () => new PlaneGeometry(BOARD_3D_CENTER_EMBLEM_SIZE, BOARD_3D_CENTER_EMBLEM_SIZE),
    []
  );

  useEffect(() => {
    return () => {
      gridMergedGeometry.dispose();
      boardPlaneGeometry.dispose();
      emblemPlaneGeometry.dispose();
    };
  }, [gridMergedGeometry, boardPlaneGeometry, emblemPlaneGeometry]);

  const midX = (ZONE_POSITIONS.bottomPlayer.active.x + ZONE_POSITIONS.topPlayer.active.x) / 2;
  const midZ = (ZONE_POSITIONS.bottomPlayer.active.z + ZONE_POSITIONS.topPlayer.active.z) / 2;

  const emblemMesh = (
    <mesh
      geometry={emblemPlaneGeometry}
      material={emblemMaterial}
      rotation={[-Math.PI / 2, 0, Math.PI + Math.PI / 2 + Math.PI / 2]}
      scale={[1, 1, 1]}
      position={[midX, BOARD_3D_CENTER_EMBLEM_Y, midZ]}
      renderOrder={50}
      receiveShadow={false}
    />
  );

  return (
    <group>
      <mesh
        geometry={boardPlaneGeometry}
        material={boardMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, BOARD_CENTER_Z]}
        receiveShadow={false}
      />

      {bloomActive ? <Select enabled>{emblemMesh}</Select> : emblemMesh}

      <mesh
        geometry={gridMergedGeometry}
        material={gridMaterial}
        renderOrder={-1}
        userData={{ isBoardGrid: true }}
      />
    </group>
  );
}
