import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Format } from 'ptcg-server';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeckItem } from 'src/app/deck/deck-card/deck-card.interface';
import { FormatValidator } from 'src/app/util/formats-validator';
import { CardsBaseService } from '../cards/cards-base.service';

@Component({
  selector: 'ptcg-deck-validity',
  templateUrl: './deck-validity.component.html',
  styleUrls: ['./deck-validity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeckValidityComponent {

  constructor(private cardsBaseService: CardsBaseService) {}

  public formats = [
    { value: Format.STANDARD, label: 'LABEL_STANDARD' },
    { value: Format.STANDARD_NIGHTLY, label: 'LABEL_STANDARD_NIGHTLY' },
    { value: Format.GLC, label: 'LABEL_GLC' },
    { value: Format.EXPANDED, label: 'LABEL_EXPANDED' },
    { value: Format.SWSH, label: 'LABEL_SWSH' },
    { value: Format.SM, label: 'LABEL_SM' },
    { value: Format.XY, label: 'LABEL_XY' },
    { value: Format.BW, label: 'LABEL_BW' },
    { value: Format.RSPK, label: 'LABEL_RSPK' },
    { value: Format.RETRO, label: 'LABEL_RETRO' },
    { value: Format.UNLIMITED, label: 'LABEL_UNLIMITED' },
    { value: Format.ETERNAL, label: 'LABEL_ETERNAL' },
    // { value: Format.PRE_RELEASE, label: 'LABEL_PRE_RELEASE' },
  ];

  @Input() validOnly = false;

  @Input() validFormats: number[] | null = null;

  @Input() hiddenFormats: Format[] = [];

  @Input()
  set deck(cards: DeckItem[]) {
    this._deck.next(cards);
  }

  _deck = new BehaviorSubject<DeckItem[]>(null);
  deck$ = this._deck.asObservable();

  validFormats$ = this.deck$.pipe(
    map(cards => {
      if (this.validFormats) {
        return this.validFormats;
      }
      const cardList = [];
      cards?.forEach(card => {
        for (let i = 0; i < card.count; i++) {
          cardList.push(card.card);
        }
      });
      // Get all cards from CardsBaseService to enable ANY_PRINTING_ALLOWED checks
      const allCards = this.cardsBaseService.getCards();
      return FormatValidator.getValidFormatsForCardList(cardList, allCards);
    })
  );

  get visibleFormats() {
    return this.formats.filter(format => !this.hiddenFormats.includes(format.value));
  }
}
