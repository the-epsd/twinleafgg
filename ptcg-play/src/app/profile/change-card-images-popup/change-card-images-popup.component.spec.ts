import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AlertModule } from '../../shared/alert/alert.module';
import { ApiModule } from '../../api/api.module';
import { ChangeCardImagesPopupComponent } from './change-card-images-popup.component';
import { ValidationModule } from '../../shared/validation/validation.module';
import { CardsBaseService } from '../../shared/cards/cards-base.service';

describe('ChangeCardImagesPopupComponent', () => {
  let component: ChangeCardImagesPopupComponent;
  let fixture: ComponentFixture<ChangeCardImagesPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        AlertModule,
        ApiModule,
        FormsModule,
        TranslateModule.forRoot(),
        ValidationModule
      ],
      declarations: [ChangeCardImagesPopupComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: CardsBaseService, useValue: { setScanUrl: () => { } } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeCardImagesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
