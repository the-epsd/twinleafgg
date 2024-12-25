import { Component, Input } from '@angular/core';
import { Card, CardTag, Player, State, StoreLike } from 'ptcg-server';
import { CardsBaseService } from '../cards-base.service';
import { SettingsService } from 'src/app/table/table-sidebar/settings-dialog/settings.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'ptcg-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  exportAs: 'ptcgCard',
})
export class CardComponent {
  public scanUrl: string;
  public data: Card;
  private holoEnabled = true;
  private destroyed$ = new Subject<void>();

  @Input() showCardName: boolean = true;
  @Input() cardback = false;
  @Input() placeholder = false;
  @Input() customImageUrl: string;
  @Input() set card(value: Card) {
    this.data = value;
    this.scanUrl = this.customImageUrl || this.cardsBaseService.getScanUrl(this.data);
  }

  shouldShowCardName(): boolean {
    if (!this.data || this.cardback || !this.showCardName) {
      return false; // Don't show card name if card is secret
    }
    return true; // Otherwise, use the showCardName input
  }


  getCardClass(): string {
    let classes = '';

    if (!this.data || !this.data.tags || this.cardback || !this.holoEnabled) {
      return '';
    }

    if (this.isHoloCard()) {
      return 'holo';
    }

    if (this.isHoloTrainer()) {
      return 'trainer-holo';
    }

    if (this.data.tags.includes(CardTag.POKEMON_V)
      || this.data.tags.includes(CardTag.POKEMON_ex)
      || this.data.tags.includes(CardTag.POKEMON_EX)
      || this.data.tags.includes(CardTag.POKEMON_GX)
      || this.data.tags.includes(CardTag.POKEMON_VMAX)
      || this.data.tags.includes(CardTag.POKEMON_VSTAR)) {
      return 'fullart-holo';
    }

    if (this.data.tags.includes(CardTag.RADIANT)) {
      return 'radiant-holo';
    }

    if (this.data.tags.includes(CardTag.ACE_SPEC)) {
      return 'ace-spec-holo';
    }

    return '';
  }

  private isHoloCard(): boolean {
    const holoCards = [
      'Armarouge SVI',
      'Hawlucha SVI',
      'Klefki SVI',
      'Revavroom SVI',
      'Baxcalibur PAL',
      'Hydreigon PAL',
      'Lokix PAL',
      'Luxray PAL',
      'Mimikyu PAL',
      'Spiritomb PAL',
      'Tinkaton PAL',
      'Entei OBF',
      'Scizor OBF',
      'Thundurus OBF',
      'Brute Bonnet PAR',
      'Chi-Yu PAR',
      'Deoxys PAR',
      'Groudon PAR',
      'Latios PAR',
      'Morpeko PAR',
      'Xatu PAR',
      'Zacian PAR',
      'Dudunsparce TEF',
      'Feraligatr TEF',
      'Flutter Mane TEF',
      'Iron Thorns TEF',
      'Iron Jugulis TEF',
      'Koraidon TEF',
      'Miraidon TEF',
      'Roaring Moon TEF',
      'Froslass TWM',
      'Infernape TWM',
      'Iron Leaves TWM',
      'Munkidori TWM',
      'Okidogi TWM',
      'Ting-Lu TWM',
      'Walking Wake TWM',
      'Zapdos TWM',

    ];
    return holoCards.includes(this.data.fullName);
  }

  private isHoloTrainer(): boolean {
    const holoTrainers = [
      'Professors Research SVI',
      'Professor\'s Research PAF',
      'Boss\'s Orders PAL',
    ];
    return holoTrainers.includes(this.data.fullName);
  }

  constructor(private cardsBaseService: CardsBaseService,
    private settingsService: SettingsService) {
    settingsService.holoEnabled$.subscribe(enabled => this.holoEnabled = enabled);
    settingsService.showCardName$.subscribe(enabled => this.showCardName = enabled);
  }

  ngOnInit(): void {
    this.settingsService.showCardName$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(enabled => {
      this.showCardName = enabled;
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}