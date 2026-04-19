import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../utils/cn';
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
}: CardFaceProps) {
  const showImg = src.trim().length > 0;
  return (
    <div className={cn(styles.root, className)} style={style}>
      <div
        className={cn(styles.inner, shadow === 'deckInDeck' && styles.innerInDeckRing)}
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
        {children}
      </div>
    </div>
  );
}
