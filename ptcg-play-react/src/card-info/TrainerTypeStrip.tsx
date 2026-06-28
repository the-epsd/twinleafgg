import { TrainerType } from 'ptcg-server';
import { cn } from '../utils/cn';
import styles from './TrainerTypeStrip.module.css';

export function TrainerTypeStrip({ type, className }: { type?: TrainerType; className?: string }) {
  let cls = styles.energy;
  if (type === TrainerType.SUPPORTER) {
    cls = styles.supporter;
  } else if (type === TrainerType.STADIUM) {
    cls = styles.stadium;
  } else if (type === TrainerType.ITEM || type === TrainerType.TOOL) {
    cls = styles.item;
  }
  return <span className={cn(styles.strip, cls, className)} aria-hidden />;
}
