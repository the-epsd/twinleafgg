import { Component, Input } from '@angular/core';
import { Card, CardTag } from 'ptcg-server';
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
  // Optional overlay image URL (e.g., selected artwork) applied on top of base image
  @Input() customArtworkUrl?: string;
  @Input() cardList?: any;
  @Input() set card(value: Card) {
    this.data = value;
    this.scanUrl = this.resolveScanUrl();
  }

  @Input() set artworksContext(list: any) {
    this.cardList = list;
    if (this.data && !this.customImageUrl) {
      this.scanUrl = this.resolveScanUrl();
    }
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
      || this.data.tags.includes(CardTag.POKEMON_VSTAR)
      || this.data.tags.includes(CardTag.POKEMON_VUNION)
      || this.data.tags.includes(CardTag.POKEMON_LV_X)) {
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
      //SVI
      'Armarouge SVI',
      'Hawlucha SVI',
      'Klefki SVI',
      'Revavroom SVI',
      //PAL
      'Baxcalibur PAL',
      'Hydreigon PAL',
      'Lokix PAL',
      'Luxray PAL',
      'Mimikyu PAL',
      'Spiritomb PAL',
      'Tinkaton PAL',
      //OBF
      'Entei OBF',
      'Scizor OBF',
      'Thundurus OBF',
      //PAR
      'Brute Bonnet PAR',
      'Chi-Yu PAR',
      'Deoxys PAR',
      'Groudon PAR',
      'Latios PAR',
      'Morpeko PAR',
      'Xatu PAR',
      'Zacian PAR',
      //TEF
      'Dudunsparce TEF',
      'Feraligatr TEF',
      'Flutter Mane TEF',
      'Iron Thorns TEF',
      'Iron Jugulis TEF',
      'Koraidon TEF',
      'Miraidon TEF',
      'Roaring Moon TEF',
      //TWM
      'Froslass TWM',
      'Infernape TWM',
      'Iron Leaves TWM',
      'Munkidori TWM',
      'Okidogi TWM',
      'Ting-Lu TWM',
      'Walking Wake TWM',
      'Zapdos TWM',
      'Sinistcha TWM',
      'Teal Mask Ogerpon TWM',
      'Chandelure TWM',
      'Alakazam TWM',
      'Enamorus TWM',
      'Fezandipiti TWM',
      'Hisuian Arcanine TWM',
      'Heatran TWM',
      //SCR
      'Drednaw SV7',
      'Zeraora SV7',
      'Alcremie SV7',
      'Iron Boulder SV7',
      'Rhyperior SV7',
      'Grimmsnarl SV7',
      'Klinklang SV7',
      'Melmetal SV7',
      'Archaludon SV7',
      'Raging Bolt SV7',
      'Noctowl SV7',
      'Bouffalant SV7',
      //SSP
      'Zarude SV8',
      'Rabsca SV8',
      'Skeledirge SV8',
      'Gouging Fire SV8',
      'Chien-Pao SV8',
      'Tapu Koko SV8',
      'Togekiss SV8',
      'Cofagrigus SV8',
      'Tapu Lele SV8',
      'Gastrodon SV8',
      'Landorus SV8',
      'Iron Crown SV8',
      'Dialga SV8',
      'Palkia SV8',
      'Eternatus SV8',
      'Terapagos SV8',
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

  private resolveScanUrl(): string {
    if (this.customImageUrl) {
      return this.customImageUrl;
    }
    return this.cardsBaseService.getScanUrl(this.data);
  }

  // Resolve overlay artwork URL from artworksContext when not explicitly provided
  get overlayUrl(): string | undefined {
    if (this.customArtworkUrl) {
      return this.customArtworkUrl;
    }
    const artworksMap = (this.cardList as any)?.artworksMap as { [code: string]: { imageUrl: string } } | undefined;
    if (artworksMap && this.data && artworksMap[this.data.fullName]?.imageUrl) {
      return artworksMap[this.data.fullName].imageUrl;
    }
    const map = (this.cardList as any);
    if (map && this.data && map[this.data.fullName]?.imageUrl) {
      return map[this.data.fullName].imageUrl;
    }
    // Fallback: if a broader state object is provided, try players' artworksMap
    // const players = (this.cardList as any)?.players as any[] | undefined;
    // if (players && this.data) {
    //   for (const player of players) {
    //     const pMap = (player as any)?.artworksMap as { [code: string]: { imageUrl: string } } | undefined;
    //     if (pMap && pMap[this.data.fullName]?.imageUrl) {
    //       return pMap[this.data.fullName].imageUrl;
    //     }
    //   }
    // }
    return undefined;
  }

  ngOnInit(): void {
    this.settingsService.showCardName$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(enabled => {
      this.showCardName = enabled;
    });

    this.cardsBaseService.overridesChanged$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(identifier => {
      if (!this.data) { return; }
      const myIdentifier = `${this.data.set} ${this.data.setNumber}`;
      if (identifier === myIdentifier) {
        this.scanUrl = this._customImageUrl || this.cardsBaseService.getScanUrl(this.data);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}