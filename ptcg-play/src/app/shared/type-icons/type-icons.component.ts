import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CardType } from 'ptcg-server';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ptcg-type-icons',
  templateUrl: './type-icons.component.html',
  styleUrls: ['./type-icons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeIconsComponent {
  cardType = CardType;
  
  @Input() align: 'center' | 'start' = 'center';
  @Input() showAll = true;
  @Input() 
  set typeSetter(cardType: CardType) {
    this.selectedType.next(cardType);
  }

  @Output() typeSelected = new EventEmitter<CardType | null>();
  
  selectedType = new BehaviorSubject<CardType | null>(null);
}
