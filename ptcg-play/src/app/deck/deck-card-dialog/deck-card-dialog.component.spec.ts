import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckCardDialogComponent } from './deck-card-dialog.component';

describe('DeckCardDialogComponent', () => {
  let component: DeckCardDialogComponent;
  let fixture: ComponentFixture<DeckCardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckCardDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
