import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { CardSwapDialogComponent, CardSwapDialogData } from './card-swap-dialog.component';
import { Card } from 'ptcg-server';

describe('CardSwapDialogComponent', () => {
  let component: CardSwapDialogComponent;
  let fixture: ComponentFixture<CardSwapDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<CardSwapDialogComponent>>;
  let mockData: CardSwapDialogData;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockData = {
      currentCard: {} as Card,
      alternativeCards: []
    };

    await TestBed.configureTestingModule({
      declarations: [CardSwapDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CardSwapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with selected card when onCardSelected is called', () => {
    const selectedCard = {} as Card;
    component.onCardSelected(selectedCard);
    expect(mockDialogRef.close).toHaveBeenCalledWith({ selectedCard });
  });

  it('should close dialog without result when onCancel is called', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
