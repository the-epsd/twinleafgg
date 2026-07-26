import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';
import { resolveAvatarUrl } from '../utils/avatarUrl';
import styles from './Avatar.module.css';

export type AvatarSize = 'default' | 'profile' | 'double';

export type AvatarProps = {
  avatarFile?: string;
  size?: AvatarSize;
  hoverable?: boolean;
  className?: string;
  alt?: string;
  onClick?: () => void;
};

export function Avatar({
  avatarFile,
  size = 'default',
  hoverable = false,
  className,
  alt = '',
  onClick,
}: AvatarProps) {
  const { serverConfig } = useAuth();
  const src = resolveAvatarUrl(avatarFile, serverConfig);

  const rootClass = cn(
    styles.avatar,
    size === 'profile' && styles.profile,
    size === 'double' && styles.double,
    hoverable && styles.hoverable,
    className,
  );

  const content = src ? (
    <img className={styles.image} src={src} alt={alt} />
  ) : (
    <div className={styles.empty} aria-hidden />
  );

  if (onClick) {
    return (
      <button type="button" className={rootClass} onClick={onClick} aria-label={alt || 'Avatar'}>
        {content}
      </button>
    );
  }

  return <div className={rootClass}>{content}</div>;
}
