import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { CardInfoListPopupComponent } from './card-info-list-popup.component';

describe('CardInfoListPopupComponent', () => {
  let component: CardInfoListPopupComponent;
  let fixture: ComponentFixture<CardInfoListPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        TranslateModule.forRoot(),
        FormsModule
      ],
      declarations: [CardInfoListPopupComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            card: {},
            cardList: { cards: [] },
            facedown: false,
            allowReveal: false,
            options: {}
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardInfoListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read sortDiscards from localStorage on init', () => {
    spyOn(localStorage, 'getItem').and.returnValue('true');
    component.ngOnInit();
    expect(component.sortDiscards).toBeTrue();
  });

  it('should write sortDiscards to localStorage on toggle', () => {
    spyOn(localStorage, 'setItem');
    component.sortDiscards = true;
    component.onSortDiscardsToggle();
    expect(localStorage.setItem).toHaveBeenCalledWith('sortDiscardsPreference', 'true');
  });
});
