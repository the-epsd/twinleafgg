import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Format } from 'ptcg-server';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly HOLO_ENABLED_KEY = 'holoEnabled';
  private readonly SHOW_CARD_NAMES_KEY = 'showCardName';
  private readonly SHOW_TAGS_KEY = 'showTags';
  private readonly CARD_SIZE_KEY = 'cardSize';
  private readonly HIDDEN_FORMATS_KEY = 'hiddenFormats';

  private holoEnabledSubject = new BehaviorSubject<boolean>(this.loadHoloSetting());
  private cardSizeSubject = new BehaviorSubject<number>(100);
  private showCardNameSubject = new BehaviorSubject<boolean>(this.loadCardNamesSetting());
  private showTagsSubject = new BehaviorSubject<boolean>(this.loadTagsSetting());
  private hiddenFormatsSubject = new BehaviorSubject<Format[]>(this.loadHiddenFormats());

  cardSize$ = this.cardSizeSubject.asObservable();
  holoEnabled$ = this.holoEnabledSubject.asObservable();
  showCardName$ = this.showCardNameSubject.asObservable();
  showTags$ = this.showTagsSubject.asObservable();
  hiddenFormats$ = this.hiddenFormatsSubject.asObservable();

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
}