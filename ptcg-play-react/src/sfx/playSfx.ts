import { SFX_URLS, type SfxId } from './sfxAssets';

type SfxSettings = {
  enabled: boolean;
  volume: number;
};

let settings: SfxSettings = { enabled: true, volume: 0.7 };
const audioCache = new Map<SfxId, HTMLAudioElement>();
let exclusivePlaying: HTMLAudioElement | null = null;

export function configureSfx(next: Partial<SfxSettings>): void {
  if (next.enabled !== undefined) {
    settings.enabled = next.enabled;
    if (!settings.enabled) {
      stopExclusiveSfx();
    }
  }
  if (next.volume !== undefined) {
    settings.volume = Math.max(0, Math.min(1, next.volume));
    audioCache.forEach((audio) => {
      audio.volume = settings.volume;
    });
    if (exclusivePlaying) {
      exclusivePlaying.volume = settings.volume;
    }
  }
}

function getOrCreateAudio(id: SfxId): HTMLAudioElement {
  let audio = audioCache.get(id);
  if (!audio) {
    audio = new Audio(SFX_URLS[id]);
    audio.preload = 'auto';
    audio.addEventListener('error', () => {
      console.warn(`Failed to load SFX: ${id}`);
    });
    audioCache.set(id, audio);
  }
  audio.volume = settings.volume;
  return audio;
}

function canPlay(): boolean {
  return settings.enabled && !document.hidden;
}

export function stopExclusiveSfx(): void {
  if (!exclusivePlaying) {
    return;
  }
  exclusivePlaying.pause();
  exclusivePlaying.currentTime = 0;
  exclusivePlaying = null;
}

/**
 * Play a one-shot SFX. Overlapping plays clone from the cached element so
 * energy/draw can layer; exclusive mode stops the previous exclusive clip.
 */
export function playSfx(id: SfxId, options?: { exclusive?: boolean }): void {
  if (!canPlay()) {
    return;
  }

  const exclusive = options?.exclusive === true;
  if (exclusive) {
    stopExclusiveSfx();
  }

  const base = getOrCreateAudio(id);
  const audio = exclusive ? base : (base.cloneNode(true) as HTMLAudioElement);
  audio.volume = settings.volume;

  if (exclusive) {
    exclusivePlaying = audio;
    audio.addEventListener(
      'ended',
      () => {
        if (exclusivePlaying === audio) {
          exclusivePlaying = null;
        }
      },
      { once: true },
    );
  }

  audio.currentTime = 0;
  void audio.play().catch((error) => {
    console.warn(`Failed to play SFX: ${id}`, error);
    if (exclusivePlaying === audio) {
      exclusivePlaying = null;
    }
  });
}
