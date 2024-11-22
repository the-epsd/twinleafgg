import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly HOLO_ENABLED_KEY = 'holoEnabled';
  private holoEnabledSubject = new BehaviorSubject<boolean>(this.loadHoloSetting());
  private readonly CARD_SIZE_KEY = 'cardSize';
  private cardSizeSubject = new BehaviorSubject<number>(100);
  cardSize$ = this.cardSizeSubject.asObservable();

  holoEnabled$ = this.holoEnabledSubject.asObservable();

  private loadHoloSetting(): boolean {
    const saved = localStorage.getItem(this.HOLO_ENABLED_KEY);
    return saved ? JSON.parse(saved) : true;
  }

  setHoloEnabled(enabled: boolean) {
    localStorage.setItem(this.HOLO_ENABLED_KEY, JSON.stringify(enabled));
    this.holoEnabledSubject.next(enabled);
  }

  setCardSize(size: number) {
    localStorage.setItem(this.CARD_SIZE_KEY, size.toString());
    this.cardSizeSubject.next(size);
  }
}
