import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DndModule } from '@ng-dnd/core';
import { DndSortableModule } from '@ng-dnd/sortable';
import { TranslateModule } from '@ngx-translate/core';
import { TestBackend } from 'react-dnd-test-backend';

import { ApiModule } from '../../../api/api.module';
import { ChooseCardsPanes2Component } from './choose-cards-panes-2.component';

describe('ChooseCardsPanes2Component', () => {
  let component: ChooseCardsPanes2Component;
  let fixture: ComponentFixture<ChooseCardsPanes2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        DndModule.forRoot({ backend: TestBackend }),
        DndSortableModule,
        TranslateModule.forRoot()
      ],
      declarations: [ChooseCardsPanes2Component],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseCardsPanes2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});