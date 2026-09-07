import { Suspense, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { DeckBoxModel } from './DeckBoxModel';
import { DECK_BOX_TEXTURES } from './deckBoxTextures';
import styles from './DeckBoxPreviewPage.module.css';

const DEFAULT_TEXTURE_ID = DECK_BOX_TEXTURES.find((t) => t.id === 'aurorablastxy6deck')?.id
  ?? DECK_BOX_TEXTURES[0]?.id
  ?? '';

export function DeckBoxPreviewPage() {
  const [textureId, setTextureId] = useState(DEFAULT_TEXTURE_ID);
  const [scale, setScale] = useState(1);

  const selected = useMemo(
    () => DECK_BOX_TEXTURES.find((t) => t.id === textureId) ?? DECK_BOX_TEXTURES[0],
    [textureId],
  );

  return (
    <div className={styles.page}>
      <div className={styles.viewport}>
        <Canvas
          className={styles.canvas}
          camera={{ position: [-6.5, 3.5, 5], fov: 35, near: 0.1, far: 100 }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={['#1a1c22']} />
          <ambientLight intensity={0.55} />
          <directionalLight position={[6, 10, 4]} intensity={1.15} castShadow />
          <directionalLight position={[-4, 3, -6]} intensity={0.35} />
          <Suspense fallback={null}>
            {selected ? (
              <DeckBoxModel key={selected.url} textureUrl={selected.url} scale={scale} />
            ) : null}
            <ContactShadows
              position={[0, -2.02, 0]}
              opacity={0.45}
              scale={12}
              blur={2.5}
              far={6}
            />
            <Environment preset="city" />
          </Suspense>
          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.08}
            minDistance={3}
            maxDistance={20}
            target={[0, 0, 0]}
          />
        </Canvas>
        <p className={styles.hint}>Drag to orbit · Scroll to zoom · Right-drag to pan</p>
      </div>

      <aside className={styles.sidebar}>
        <header>
          <h1 className={styles.title}>Deck Box Preview</h1>
          <p className={styles.subtitle}>
            Low-poly OBJ with cross-atlas UVs. Swap textures to verify face orientation.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Scale</h2>
          <div className={styles.scaleRow}>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.05}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              aria-label="Model scale"
            />
            <span className={styles.scaleValue}>{scale.toFixed(2)}×</span>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Texture</h2>
          {DECK_BOX_TEXTURES.length === 0 ? (
            <p className={styles.subtitle}>No PNGs found in assets/deck-boxes.</p>
          ) : (
            <ul className={styles.textureList}>
              {DECK_BOX_TEXTURES.map((tex) => {
                const active = tex.id === selected?.id;
                return (
                  <li key={tex.id}>
                    <button
                      type="button"
                      className={`${styles.textureButton}${active ? ` ${styles.textureButtonActive}` : ''}`}
                      onClick={() => setTextureId(tex.id)}
                      aria-pressed={active}
                    >
                      <img className={styles.textureThumb} src={tex.url} alt="" />
                      <span className={styles.textureLabel}>{tex.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <p className={styles.dims}>
          Model: 2.3″ W × 4.0″ H × 3.0″ D
          <br />
          Atlas: cross net · back mirrors front
        </p>
      </aside>
    </div>
  );
}
