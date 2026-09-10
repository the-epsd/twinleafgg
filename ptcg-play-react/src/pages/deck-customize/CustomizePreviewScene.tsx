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

function PreviewCamera({
  layout,
  editLayout,
  mode,
}: {
  layout: CustomizePreviewLayout;
  editLayout: boolean;
  mode: PreviewMode;
}) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;

  useLayoutEffect(() => {
    if (editLayout || mode === 'all') {
      camera.position.set(...layout.camera.position);
      camera.fov = layout.camera.fov;
      camera.lookAt(...layout.camera.target);
    } else {
      camera.position.set(-3.5, 2.8, 7.5);
      camera.lookAt(0, 0, 0);
    }
    camera.updateProjectionMatrix();
  }, [camera, editLayout, layout.camera.fov, layout.camera.position, layout.camera.target, mode]);

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
  const focused = !editLayout && mode === 'focused';

  const boxT: PropTransform = focused
    ? { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1.1 }
    : layout.box;
  const sleeveT: PropTransform = focused
    ? { position: [0, 0.35, 0], rotation: [0, 0, 0], scale: 1.35 }
    : layout.sleeve;
  const coinT: PropTransform = focused
    ? { position: [0, 0, 0.5], rotation: [0, 0.1, 0], scale: 1.85 }
    : layout.coin;

  return (
    <>
      <PreviewCamera layout={layout} editLayout={editLayout} mode={mode} />
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
            transform={coinT}
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
            transform={boxT}
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
            transform={sleeveT}
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

        <ContactShadows position={[0, -2.05, 0]} opacity={0.18} scale={16} blur={2.8} far={6} color="#6a6a6a" />
        <Environment preset="city" />
      </Suspense>
    </>
  );
}
