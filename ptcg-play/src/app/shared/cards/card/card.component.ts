import { Component, Input, OnInit, OnDestroy, HostBinding } from '@angular/core';
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
export class CardComponent implements OnInit, OnDestroy {
  public scanUrl: string;
  public data: Card;
  private holoEnabled = true;
  private destroyed$ = new Subject<void>();

  @Input() showCardName: boolean = true;
  @Input() cardback = false;
  @Input() placeholder = false;
  @Input() customImageUrl: string;
  @Input() cardbackUrl?: string;
  // Optional overlay image URL (e.g., selected artwork) applied on top of base image
  @Input() customArtworkUrl?: string;
  @Input() cardList?: any;
  @Input() isPlayable: boolean = false;
  @Input() set card(value: Card) {
    this.data = value;
    // Check if card is Unknown and skip URL generation
    if (value && (value.fullName === 'Unknown' || value.name === 'Unknown')) {
      this.scanUrl = ''; // Don't generate URL for Unknown cards
    } else {
      this.scanUrl = this.resolveScanUrl();
    }
  }

  // Getter to check if card should be treated as cardback (either explicitly set or Unknown card)
  get isCardback(): boolean {
    return this.cardback || (this.data && (this.data.fullName === 'Unknown' || this.data.name === 'Unknown'));
  }

  @Input() set artworksContext(list: any) {
    this.cardList = list;
    if (this.data && !this.customImageUrl) {
      // Check if card is Unknown and skip URL generation
      if (this.data.fullName === 'Unknown' || this.data.name === 'Unknown') {
        this.scanUrl = ''; // Don't generate URL for Unknown cards
      } else {
        this.scanUrl = this.resolveScanUrl();
      }
    }
  }

  shouldShowCardName(): boolean {
    if (!this.data || this.isCardback || !this.showCardName) {
      return false; // Don't show card name if card is secret or Unknown
    }
    return true; // Otherwise, use the showCardName input
  }


  getCardClass(): string {
    let classes = '';

    if (!this.data || !this.data.tags || this.isCardback || !this.holoEnabled) {
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
      'Armarouge (SVI 41)',
      'Hawlucha (SVI 118)',
      'Klefki (SVI 96)',
      'Revavroom (SVI 142)',
      //PAL
      'Baxcalibur (PAL 60)',
      'Hydreigon (PAL 140)',
      'Lokix (PAL 21)',
      'Luxray (PAL 71)',
      'Mimikyu (PAL 97)',
      'Spiritomb (PAL 89)',
      'Tinkaton (PAL 105)',
      //OBF
      'Entei (OBF 30)',
      'Scizor (OBF 141)',
      'Thundurus (OBF 70)',
      //PAR
      'Brute Bonnet (PAR 123)',
      'Chi-Yu (PAR 29)',
      'Deoxys (PAR 74)',
      'Groudon (PAR 93)',
      'Latios (PAR 73)',
      'Morpeko (PAR 121)',
      'Xatu (PAR 72)',
      'Zacian (PAR 136)',
      //TEF
      'Dudunsparce (TEF 129)',
      'Feraligatr (TEF 41)',
      'Flutter Mane (TEF 78)',
      'Iron Thorns (TEF 62)',
      'Iron Jugulis (TEF 139)',
      'Koraidon (TEF 119)',
      'Miraidon (TEF 121)',
      'Roaring Moon (TEF 109)',
      //TWM
      'Froslass (TWM 53)',
      'Infernape (TWM 33)',
      'Iron Leaves (TWM 19)',
      'Munkidori (TWM 95)',
      'Okidogi (TWM 111)',
      'Ting-Lu (TWM 110)',
      'Walking Wake (TWM 63)',
      'Zapdos (TWM 65)',
      'Sinistcha (TWM 22)',
      'Teal Mask Ogerpon (TWM 24)',
      'Chandelure (TWM 38)',
      'Alakazam (TWM 82)',
      'Enamorus (TWM 93)',
      'Fezandipiti (TWM 96)',
      'Hisuian Arcanine (TWM 100)',
      'Heatran (TWM 123)',
      //SCR
      'Drednaw (SCR 44)',
      'Zeraora (SCR 55)',
      'Alcremie (SCR 65)',
      'Iron Boulder (SCR 71)',
      'Rhyperior (SCR 76)',
      'Grimmsnarl (SCR 96)',
      'Klinklang (SCR 101)',
      'Melmetal (SCR 104)',
      'Archaludon (SCR 107)',
      'Raging Bolt (SCR 111)',
      'Noctowl (SCR 115)',
      'Bouffalant (SCR 119)',
      //SSP
      'Zarude (SSP 11)',
      'Rabsca (SSP 14)',
      'Skeledirge (SSP 31)',
      'Gouging Fire (SSP 38)',
      'Chien-Pao (SSP 56)',
      'Tapu Koko (SSP 65)',
      'Togekiss (SSP 72)',
      'Cofagrigus (SSP 83)',
      'Tapu Lele (SSP 92)',
      'Gastrodon (SSP 107)',
      'Landorus (SSP 110)',
      'Iron Crown (SSP 132)',
      'Dialga (SSP 135)',
      'Palkia (SSP 136)',
      'Eternatus (SSP 141)',
      'Terapagos (SSP 161)',
    ];
    return holoCards.includes(this.data.fullName);
  }

  private isHoloTrainer(): boolean {
    const holoTrainers = [
      'Professor\'s Research (SVI 189)',
      'Professor\'s Research (PAF 87)',
      'Boss\'s Orders (PAL 172)',
    ];
    return holoTrainers.includes(this.data.fullName);
  }

  constructor(private cardsBaseService: CardsBaseService,
    private settingsService: SettingsService) {
    settingsService.holoEnabled$.subscribe(enabled => this.holoEnabled = enabled);
    settingsService.showCardName$.subscribe(enabled => this.showCardName = enabled);
  }

  @Input() set cardbackImageUrl(url: string | undefined) {
    this.cardbackUrl = url;
  }

  @HostBinding('style.--cardback-url')
  get cardbackCssVar(): string | null {
    return this.cardbackUrl ? `url(${this.cardbackUrl})` : null;
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
    
    // Check for artworksMap lookup (for deck-selected artworks)
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
        this.scanUrl = this.customImageUrl || this.cardsBaseService.getScanUrl(this.data);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}