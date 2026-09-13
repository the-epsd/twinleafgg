import { Suspense, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import {
  ContactShadows,
  Environment,
  OrbitControls,
  TransformControls,
  useTexture,
} from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import {
  ClampToEdgeWrapping,
  DoubleSide,
  LinearFilter,
  LinearMipmapLinearFilter,
  SRGBColorSpace,
  type Group,
  type Object3D,
  type PerspectiveCamera,
  type Texture,
} from 'three';
import { DeckBoxModel } from '../deck-box-preview/DeckBoxModel';
import type {
  CustomizePreviewLayout,
  LayoutPropId,
  PropTransform,
  Vec3,
} from './customizePreviewLayout';

export type PreviewMode = 'all' | 'focused';
export type FocusTarget = 'deck_boxes' | 'sleeves' | 'coins';
export type TransformMode = 'translate' | 'rotate' | 'scale';

type CustomizePreviewSceneProps = {
  mode: PreviewMode;
  focus: FocusTarget;
  boxTextureUrl: string;
  sleeveTextureUrl: string;
  coinTextureUrl: string;
  layout: CustomizePreviewLayout;
  editLayout?: boolean;
  selectedProp?: LayoutPropId;
  transformMode?: TransformMode;
  orbitEnabled?: boolean;
  onOrbitEnabledChange?: (enabled: boolean) => void;
  onSelectProp?: (id: LayoutPropId) => void;
  onPropTransform?: (id: LayoutPropId, next: PropTransform) => void;
  onCameraChange?: (camera: CustomizePreviewLayout['camera']) => void;
};

const SLEEVE_BASE_W = 2.2;
const SLEEVE_BASE_H = 3.05;
const COIN_RADIUS = 0.85;

function configureMap(texture: Texture) {
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.flipY = true;
  texture.generateMipmaps = true;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
}

function TexturedPlane({ url, width, height }: { url: string; width: number; height: number }) {
  const texture = useTexture(url);
  useEffect(() => {
    configureMap(texture);
  }, [texture]);

  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial map={texture} side={DoubleSide} roughness={0.55} metalness={0.05} />
    </mesh>
  );
}

function CoinMesh({ url }: { url: string }) {
  const texture = useTexture(url);
  useEffect(() => {
    configureMap(texture);
  }, [texture]);

  return (
    <mesh renderOrder={2}>
      <circleGeometry args={[COIN_RADIUS, 48]} />
      <meshStandardMaterial map={texture} side={DoubleSide} roughness={0.35} metalness={0.45} />
    </mesh>
  );
}

function applyTransform(obj: Object3D, t: PropTransform) {
  obj.position.set(t.position[0], t.position[1], t.position[2]);
  obj.rotation.set(t.rotation[0], t.rotation[1], t.rotation[2]);
  obj.scale.setScalar(t.scale);
}

function readTransform(obj: Object3D): PropTransform {
  return {
    position: [obj.position.x, obj.position.y, obj.position.z],
    rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
    scale: obj.scale.x,
  };
}

/** How much closer than Preview All. Smaller = larger on screen. */
const FOCUS_DISTANCE_SCALE = 0.68;
/** Apparent size vs the shared focus framing. 0.8 = 20% smaller. */
const FOCUS_SIZE: Record<FocusTarget, number> = {
  deck_boxes: 0.8,
  sleeves: 1,
  coins: 1,
};

function layoutProp(layout: CustomizePreviewLayout, focus: FocusTarget): PropTransform {
  if (focus === 'deck_boxes') return layout.box;
  if (focus === 'sleeves') return layout.sleeve;
  return layout.coin;
}

/**
 * Centers the focused prop and pulls the camera in, using the same camera-to-object
 * direction as Preview All so rotation still reads the same.
 */
function focusedCamera(
  layout: CustomizePreviewLayout,
  focus: FocusTarget,
): { position: Vec3; target: Vec3 } {
  const prop = layoutProp(layout, focus);
  const [px, py, pz] = prop.position;
  const [cx, cy, cz] = layout.camera.position;
  const dx = cx - px;
  const dy = cy - py;
  const dz = cz - pz;
  const len = Math.hypot(dx, dy, dz) || 1;
  const distance = Math.max(2.4, (len * FOCUS_DISTANCE_SCALE) / FOCUS_SIZE[focus]);
  return {
    position: [px + (dx / len) * distance, py + (dy / len) * distance, pz + (dz / len) * distance],
    target: [px, py, pz],
  };
}

function PreviewCamera({
  layout,
  editLayout,
  mode,
  focus,
}: {
  layout: CustomizePreviewLayout;
  editLayout: boolean;
  mode: PreviewMode;
  focus: FocusTarget;
}) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;

  useLayoutEffect(() => {
    camera.fov = layout.camera.fov;
    if (editLayout || mode === 'all') {
      camera.position.set(...layout.camera.position);
      camera.lookAt(...layout.camera.target);
    } else {
      const framed = focusedCamera(layout, focus);
      camera.position.set(...framed.position);
      camera.lookAt(...framed.target);
    }
    camera.updateProjectionMatrix();
  }, [camera, editLayout, focus, layout, mode]);

  return null;
}

function EditableProp({
  id,
  transform,
  editLayout,
  selected,
  transformMode,
  onSelect,
  onTransform,
  onDraggingChange,
  children,
}: {
  id: LayoutPropId;
  transform: PropTransform;
  editLayout: boolean;
  selected: boolean;
  transformMode: TransformMode;
  onSelect?: (id: LayoutPropId) => void;
  onTransform?: (id: LayoutPropId, next: PropTransform) => void;
  onDraggingChange?: (dragging: boolean) => void;
  children: ReactNode;
}) {
  const groupRef = useRef<Group>(null);
  const [object, setObject] = useState<Group | null>(null);
  const dragging = useRef(false);

  useLayoutEffect(() => {
    if (!groupRef.current || dragging.current) return;
    applyTransform(groupRef.current, transform);
  }, [transform]);

  return (
    <>
      <group
        ref={(node) => {
          groupRef.current = node;
          setObject(node);
        }}
        onClick={(e) => {
          if (!editLayout) return;
          e.stopPropagation();
          onSelect?.(id);
        }}
      >
        {children}
      </group>
      {editLayout && selected && object ? (
        <TransformControls
          object={object}
          mode={transformMode}
          size={0.9}
          onMouseDown={() => {
            dragging.current = true;
            onDraggingChange?.(true);
          }}
          onMouseUp={() => {
            dragging.current = false;
            onDraggingChange?.(false);
            onTransform?.(id, readTransform(object));
          }}
          onObjectChange={() => {
            onTransform?.(id, readTransform(object));
          }}
        />
      ) : null}
    </>
  );
}

function OrbitAndCameraSync({
  enabled,
  target,
  onCameraChange,
}: {
  enabled: boolean;
  target: [number, number, number];
  onCameraChange?: (camera: CustomizePreviewLayout['camera']) => void;
}) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enabled={enabled}
      enableDamping
      dampingFactor={0.08}
      target={target}
      minDistance={2}
      maxDistance={28}
      onEnd={() => {
        if (!onCameraChange) return;
        const t = controlsRef.current?.target;
        onCameraChange({
          position: [camera.position.x, camera.position.y, camera.position.z],
          target: t ? [t.x, t.y, t.z] : [...target],
          fov: camera.fov,
        });
      }}
    />
  );
}

export function CustomizePreviewScene({
  mode,
  focus,
  boxTextureUrl,
  sleeveTextureUrl,
  coinTextureUrl,
  layout,
  editLayout = false,
  selectedProp = 'box',
  transformMode = 'translate',
  orbitEnabled = true,
  onOrbitEnabledChange,
  onSelectProp,
  onPropTransform,
  onCameraChange,
}: CustomizePreviewSceneProps) {
  const showBox = editLayout || mode === 'all' || focus === 'deck_boxes';
  const showSleeve = editLayout || mode === 'all' || focus === 'sleeves';
  const showCoin = editLayout || mode === 'all' || focus === 'coins';

  return (
    <>
      <PreviewCamera layout={layout} editLayout={editLayout} mode={mode} focus={focus} />
      {editLayout ? (
        <OrbitAndCameraSync
          enabled={orbitEnabled}
          target={layout.camera.target}
          onCameraChange={onCameraChange}
        />
      ) : null}
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 10, 6]} intensity={1.15} />
      <directionalLight position={[-6, 3, -2]} intensity={0.4} />
      <Suspense fallback={null}>
        {showCoin && coinTextureUrl ? (
          <EditableProp
            id="coin"
            transform={layout.coin}
            editLayout={editLayout}
            selected={selectedProp === 'coin'}
            transformMode={transformMode}
            onSelect={onSelectProp}
            onTransform={onPropTransform}
            onDraggingChange={(d) => onOrbitEnabledChange?.(!d)}
          >
            <CoinMesh key={`coin-${coinTextureUrl}`} url={coinTextureUrl} />
          </EditableProp>
        ) : null}

        {showBox && boxTextureUrl ? (
          <EditableProp
            id="box"
            transform={layout.box}
            editLayout={editLayout}
            selected={selectedProp === 'box'}
            transformMode={transformMode}
            onSelect={onSelectProp}
            onTransform={onPropTransform}
            onDraggingChange={(d) => onOrbitEnabledChange?.(!d)}
          >
            <DeckBoxModel key={boxTextureUrl} textureUrl={boxTextureUrl} scale={1} rotationY={0} />
          </EditableProp>
        ) : null}

        {showSleeve && sleeveTextureUrl ? (
          <EditableProp
            id="sleeve"
            transform={layout.sleeve}
            editLayout={editLayout}
            selected={selectedProp === 'sleeve'}
            transformMode={transformMode}
            onSelect={onSelectProp}
            onTransform={onPropTransform}
            onDraggingChange={(d) => onOrbitEnabledChange?.(!d)}
          >
            <TexturedPlane
              key={`sleeve-${sleeveTextureUrl}`}
              url={sleeveTextureUrl}
              width={SLEEVE_BASE_W}
              height={SLEEVE_BASE_H}
            />
          </EditableProp>
        ) : null}

        <ContactShadows position={[0, -2.05, 0]} opacity={0.35} scale={16} blur={2.6} far={6} color="#02040a" />
        <Environment preset="city" />
      </Suspense>
    </>
  );
}
