import type { CSSProperties, ReactNode } from 'react';
import { useMemo } from 'react';
import type { Card } from 'ptcg-server';
import { useOptionalSettings } from '../../context/SettingsContext';
import { readClientSettingsSnapshot } from '../../settings/settingsStorage';
import { cn } from '../../utils/cn';
import { getHoloVariant, type HoloVariant } from './holoVariant';
import { holoMaskUrl } from './holoMaskUrl';
import styles from './CardFace.module.css';

export type CardFaceShadow = 'none' | 'deckInDeck';

export type CardFaceProps = {
  src: string;
  /** Used for empty-`src` fallback text and meaningful `alt` when showing an image. */
  name?: string;
  className?: string;
  style?: CSSProperties;
  loading?: 'lazy' | 'eager';
  draggable?: boolean;
  /** Deck library: optional “already in deck” ring — default none. */
  shadow?: CardFaceShadow;
  children?: ReactNode;
  /** When set, overrides holo resolution from `card` (use `null` to force no holo). */
  holoVariant?: HoloVariant | null;
  /** When set, holo variant is derived via Angular-style rules. Ignored if `holoVariant` is provided. */
  card?: Card | null;
  /**
   * When unset, uses `SettingsProvider` or `readClientSettingsSnapshot().holoEnabled`
   * (for use outside the provider).
   */
  holoEnabled?: boolean;
};

export function CardFace({
  src,
  name = '',
  className,
  style,
  loading = 'lazy',
  draggable = false,
  shadow = 'none',
  children,
  holoVariant: holoVariantProp,
  card,
  holoEnabled: holoEnabledProp,
}: CardFaceProps) {
  const showImg = src.trim().length > 0;
  const opt = useOptionalSettings();
  const holoEnabled = holoEnabledProp ?? opt?.holoEnabled ?? readClientSettingsSnapshot().holoEnabled;

  const activeHoloVariant = useMemo(() => {
    if (holoVariantProp !== undefined) {
      return holoVariantProp;
    }
    return card ? getHoloVariant(card, holoEnabled) : null;
  }, [holoVariantProp, card, holoEnabled]);

  const showHolo = showImg && activeHoloVariant !== null;

  const holoOverlayStyle = useMemo((): CSSProperties | undefined => {
    if (!activeHoloVariant) {
      return undefined;
    }
    const u = holoMaskUrl(activeHoloVariant);
    return { ['--holo-mask' as string]: `url('${u}')` };
  }, [activeHoloVariant]);

  return (
    <div className={cn(styles.root, className)} style={style}>
      <div
        className={cn(
          styles.inner,
          shadow === 'deckInDeck' && styles.innerInDeckRing,
          showHolo && styles.innerHolo
        )}
      >
        {showImg ? (
          <img
            src={src}
            alt=""
            loading={loading}
            decoding="async"
            draggable={draggable}
            className={styles.img}
          />
        ) : (
          <div className={styles.fallback}>{name || '—'}</div>
        )}
        {showHolo && activeHoloVariant && (
          <div className={styles.holoOverlay} style={holoOverlayStyle} />
        )}
        {children}
      </div>
    </div>
  );
}
