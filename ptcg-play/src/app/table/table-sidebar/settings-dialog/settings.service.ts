import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Format } from 'ptcg-server';
import { Board3dAccessService } from '../../../shared/services/board3d-access.service';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(private board3dAccessService: Board3dAccessService) { }
  private readonly HOLO_ENABLED_KEY = 'holoEnabled';
  private readonly SHOW_CARD_NAMES_KEY = 'showCardName';
  private readonly SHOW_TAGS_KEY = 'showTags';
  private readonly CARD_SIZE_KEY = 'cardSize';
  private readonly HIDDEN_FORMATS_KEY = 'hiddenFormats';
  private readonly USE_3D_BOARD_DEFAULT_KEY = 'use3dBoardDefault';
  private readonly CARD_TEXT_KERNING_KEY = 'cardTextKerning';
  private readonly SFX_ENABLED_KEY = 'sfxEnabled';
  private readonly SFX_VOLUME_KEY = 'sfxVolume';

  private holoEnabledSubject = new BehaviorSubject<boolean>(this.loadHoloSetting());
  private cardSizeSubject = new BehaviorSubject<number>(100);
  private showCardNameSubject = new BehaviorSubject<boolean>(this.loadCardNamesSetting());
  private showTagsSubject = new BehaviorSubject<boolean>(this.loadTagsSetting());
  private hiddenFormatsSubject = new BehaviorSubject<Format[]>(this.loadHiddenFormats());
  private use3dBoardDefaultSubject = new BehaviorSubject<boolean>(this.loadUse3dBoardDefaultSetting());
  private cardTextKerningSubject = new BehaviorSubject<number>(this.loadCardTextKerning());
  private sfxEnabledSubject = new BehaviorSubject<boolean>(this.loadSfxSetting());
  private sfxVolumeSubject = new BehaviorSubject<number>(this.loadSfxVolume());

  cardSize$ = this.cardSizeSubject.asObservable();
  holoEnabled$ = this.holoEnabledSubject.asObservable();
  showCardName$ = this.showCardNameSubject.asObservable();
  showTags$ = this.showTagsSubject.asObservable();
  hiddenFormats$ = this.hiddenFormatsSubject.asObservable();
  use3dBoardDefault$ = this.use3dBoardDefaultSubject.asObservable();
  cardTextKerning$ = this.cardTextKerningSubject.asObservable();
  sfxEnabled$ = this.sfxEnabledSubject.asObservable();
  sfxVolume$ = this.sfxVolumeSubject.asObservable();

  private loadHoloSetting(): boolean {
    const saved = localStorage.getItem(this.HOLO_ENABLED_KEY);
    return saved ? JSON.parse(saved) : true;
  }

  private loadCardNamesSetting(): boolean {
    const saved = localStorage.getItem(this.SHOW_CARD_NAMES_KEY);
    return saved ? JSON.parse(saved) : false;
  }

  private loadTagsSetting(): boolean {
    const saved = localStorage.getItem(this.SHOW_TAGS_KEY);
    return saved ? JSON.parse(saved) : false;
  }

  private loadHiddenFormats(): Format[] {
    const saved = localStorage.getItem(this.HIDDEN_FORMATS_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  private loadUse3dBoardDefaultSetting(): boolean {
    const saved = localStorage.getItem(this.USE_3D_BOARD_DEFAULT_KEY);
    return saved ? JSON.parse(saved) : false;
  }

  private loadCardTextKerning(): number {
    const saved = localStorage.getItem(this.CARD_TEXT_KERNING_KEY);
    return saved ? parseFloat(saved) : 0;
  }

  private loadSfxSetting(): boolean {
    const saved = localStorage.getItem(this.SFX_ENABLED_KEY);
    return saved ? JSON.parse(saved) : true;
  }

  private loadSfxVolume(): number {
    const saved = localStorage.getItem(this.SFX_VOLUME_KEY);
    return saved ? parseFloat(saved) : 0.7;
  }

  setHoloEnabled(enabled: boolean) {
    localStorage.setItem(this.HOLO_ENABLED_KEY, JSON.stringify(enabled));
    this.holoEnabledSubject.next(enabled);
  }

  setShowCardName(enabled: boolean) {
    localStorage.setItem(this.SHOW_CARD_NAMES_KEY, JSON.stringify(enabled));
    this.showCardNameSubject.next(enabled);
  }

  setShowTags(enabled: boolean) {
    localStorage.setItem(this.SHOW_TAGS_KEY, JSON.stringify(enabled));
    this.showTagsSubject.next(enabled);
  }

  setCardSize(size: number) {
    localStorage.setItem(this.CARD_SIZE_KEY, size.toString());
    this.cardSizeSubject.next(size);
  }

  setHiddenFormats(formats: Format[]) {
    localStorage.setItem(this.HIDDEN_FORMATS_KEY, JSON.stringify(formats));
    this.hiddenFormatsSubject.next(formats);
  }

  setUse3dBoardDefault(enabled: boolean) {
    // Only allow setting if user has 3D board access
    if (!this.board3dAccessService.has3dBoardAccess()) {
      // If user doesn't have access, ensure setting is false
      enabled = false;
      localStorage.removeItem(this.USE_3D_BOARD_DEFAULT_KEY);
    } else {
      localStorage.setItem(this.USE_3D_BOARD_DEFAULT_KEY, JSON.stringify(enabled));
    }
    this.use3dBoardDefaultSubject.next(enabled);
  }

  setCardTextKerning(value: number) {
    localStorage.setItem(this.CARD_TEXT_KERNING_KEY, value.toString());
    this.cardTextKerningSubject.next(value);
  }

  setSfxEnabled(enabled: boolean) {
    localStorage.setItem(this.SFX_ENABLED_KEY, JSON.stringify(enabled));
    this.sfxEnabledSubject.next(enabled);
  }

  setSfxVolume(volume: number) {
    // Clamp volume between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem(this.SFX_VOLUME_KEY, clampedVolume.toString());
    this.sfxVolumeSubject.next(clampedVolume);
  }
}