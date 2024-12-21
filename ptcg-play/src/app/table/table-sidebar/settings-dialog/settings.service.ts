import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly HOLO_ENABLED_KEY = 'holoEnabled';
  private readonly SHOW_CARD_NAMES_KEY = 'showCardName';
  private readonly CARD_SIZE_KEY = 'cardSize';

  private holoEnabledSubject = new BehaviorSubject<boolean>(this.loadHoloSetting());
  private cardSizeSubject = new BehaviorSubject<number>(100);
  private showCardNameSubject = new BehaviorSubject<boolean>(this.loadCardNamesSetting());

  cardSize$ = this.cardSizeSubject.asObservable();
  holoEnabled$ = this.holoEnabledSubject.asObservable();
  showCardName$ = this.showCardNameSubject.asObservable();

  private loadHoloSetting(): boolean {
    const saved = localStorage.getItem(this.HOLO_ENABLED_KEY);
    return saved ? JSON.parse(saved) : true;
  }

  private loadCardNamesSetting(): boolean {
    const saved = localStorage.getItem(this.SHOW_CARD_NAMES_KEY);
    return saved ? JSON.parse(saved) : false;
  }

  setHoloEnabled(enabled: boolean) {
    localStorage.setItem(this.HOLO_ENABLED_KEY, JSON.stringify(enabled));
    this.holoEnabledSubject.next(enabled);
  }

  setShowCardName(enabled: boolean) {
    localStorage.setItem(this.SHOW_CARD_NAMES_KEY, JSON.stringify(enabled));
    this.showCardNameSubject.next(enabled);
  }

  setCardSize(size: number) {
    localStorage.setItem(this.CARD_SIZE_KEY, size.toString());
    this.cardSizeSubject.next(size);
  }
}