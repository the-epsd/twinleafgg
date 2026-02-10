import { Injectable, OnDestroy } from '@angular/core';
import { CardType } from 'ptcg-server';
import { SettingsService } from '../../table/table-sidebar/settings-dialog/settings.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SoundService implements OnDestroy {
  private audioCache: Map<CardType, HTMLAudioElement> = new Map();
  private currentlyPlaying: HTMLAudioElement | null = null;
  private sfxEnabled = true;
  private sfxVolume = 0.7;
  private settingsSubscription: Subscription;

  constructor(private settingsService: SettingsService) {
    // Subscribe to SFX enabled setting changes
    const enabledSubscription = this.settingsService.sfxEnabled$.subscribe(
      enabled => {
        this.sfxEnabled = enabled;
        // Stop any currently playing sound if SFX is disabled
        if (!enabled && this.currentlyPlaying) {
          this.stopCurrentSound();
        }
      }
    );

    // Subscribe to SFX volume setting changes
    const volumeSubscription = this.settingsService.sfxVolume$.subscribe(
      volume => {
        this.sfxVolume = volume;
        // Update volume on all cached audio elements
        this.audioCache.forEach(audio => {
          audio.volume = volume;
        });
        // Update volume on currently playing sound
        if (this.currentlyPlaying) {
          this.currentlyPlaying.volume = volume;
        }
      }
    );

    // Combine subscriptions for cleanup
    this.settingsSubscription = new Subscription();
    this.settingsSubscription.add(enabledSubscription);
    this.settingsSubscription.add(volumeSubscription);
  }

  ngOnDestroy(): void {
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
  }

  /**
   * Maps CardType enum values to sound file names
   */
  private getSoundFileName(cardType: CardType): string | null {
    const typeMap: { [key: number]: string } = {
      [CardType.GRASS]: 'attack_grass.wav',
      [CardType.FIRE]: 'attack_fire.wav',
      [CardType.WATER]: 'attack_water.wav',
      [CardType.LIGHTNING]: 'attack_lightning.wav',
      [CardType.PSYCHIC]: 'attack_psychic.wav',
      [CardType.FIGHTING]: 'attack_fighting.wav',
      [CardType.DARK]: 'attack_dark.wav',
      [CardType.METAL]: 'attack_metal.wav',
      [CardType.COLORLESS]: 'attack_colorless.wav',
      [CardType.FAIRY]: 'attack_fairy.wav',
      [CardType.DRAGON]: 'attack_dragon.wav'
    };

    return typeMap[cardType] || null;
  }

  /**
   * Play attack sound for a specific CardType
   */
  public playAttackSound(cardType: CardType): void {
    // Check if SFX is enabled
    if (!this.sfxEnabled) {
      return;
    }

    if (!cardType || cardType === CardType.NONE) {
      return; // No sound for these types
    }

    const soundFileName = this.getSoundFileName(cardType);
    if (!soundFileName) {
      // Type not mapped or missing sound file - fail silently
      return;
    }

    // Stop currently playing sound if any
    if (this.currentlyPlaying) {
      this.currentlyPlaying.pause();
      this.currentlyPlaying.currentTime = 0;
    }

    // Check cache first
    let audio = this.audioCache.get(cardType);
    
    if (!audio) {
      // Create new audio element
      audio = new Audio(`assets/sounds/${soundFileName}`);
      audio.volume = this.sfxVolume; // Use current volume setting
      audio.preload = 'auto';
      
      // Handle errors gracefully
      audio.addEventListener('error', () => {
        console.warn(`Failed to load sound file: ${soundFileName}`);
      });

      // Clean up when finished
      audio.addEventListener('ended', () => {
        this.currentlyPlaying = null;
      });

      this.audioCache.set(cardType, audio);
    }

    // Play the sound
    this.currentlyPlaying = audio;
    audio.currentTime = 0; // Reset to start
    audio.play().catch(error => {
      console.warn(`Failed to play sound: ${soundFileName}`, error);
      this.currentlyPlaying = null;
    });
  }

  /**
   * Stop any currently playing sound
   */
  public stopCurrentSound(): void {
    if (this.currentlyPlaying) {
      this.currentlyPlaying.pause();
      this.currentlyPlaying.currentTime = 0;
      this.currentlyPlaying = null;
    }
  }
}
