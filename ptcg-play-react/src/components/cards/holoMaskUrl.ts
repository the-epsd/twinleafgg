import type { HoloVariant } from './holoVariant';
import { publicAssetUrl } from '../../utils/publicAssetUrl';

const HOLO_MASK_PATH: Record<HoloVariant, string> = {
  holo: 'assets/card-mask.png',
  'trainer-holo': 'assets/card-mask-trainer.png',
  'fullart-holo': 'assets/fa-card-mask.webp',
  'radiant-holo': 'assets/card-mask-radiant.png',
  'ace-spec-holo': 'assets/card-mask-ace-spec.png',
};

export function holoMaskUrl(variant: HoloVariant): string {
  return publicAssetUrl(HOLO_MASK_PATH[variant]);
}
