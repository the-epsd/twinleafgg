import { Link } from 'react-router-dom';
import { ShellButton } from '../../components/ui/ShellButton';
import styles from './AdminPages.module.css';

export function AdminHubPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Admin</h1>
      <p className={styles.sub}>Manage Battle Pass seasons and cosmetic catalogs.</p>
      <div className={styles.hubGrid}>
        <Link to="/admin/battle-pass" className={styles.hubCard}>
          <h2>Battle Pass Seasons</h2>
          <p>Create seasons, set date ranges, and edit reward tracks.</p>
        </Link>
        <Link to="/admin/avatars" className={styles.hubCard}>
          <h2>Avatars</h2>
          <p>Upload and manage the global avatar catalog.</p>
        </Link>
        <Link to="/admin/sleeves" className={styles.hubCard}>
          <h2>Sleeves</h2>
          <p>Upload and manage card sleeves / card backs.</p>
        </Link>
        <Link to="/admin/deck-boxes" className={styles.hubCard}>
          <h2>Deck Boxes</h2>
          <p>Upload and manage deck box textures for customization.</p>
        </Link>
        <Link to="/admin/coins" className={styles.hubCard}>
          <h2>Coins</h2>
          <p>Upload and manage coin fronts for flips and Battle Pass rewards.</p>
        </Link>
      </div>
      <div className={styles.toolbar} style={{ marginTop: 20 }}>
        <ShellButton variant="secondary" onClick={() => window.history.back()}>
          Back
        </ShellButton>
      </div>
    </div>
  );
}
