import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckValidityComponent } from './deck-validity.component';

describe('DeckValidityComponent', () => {
  let component: DeckValidityComponent;
  let fixture: ComponentFixture<DeckValidityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckValidityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckValidityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
