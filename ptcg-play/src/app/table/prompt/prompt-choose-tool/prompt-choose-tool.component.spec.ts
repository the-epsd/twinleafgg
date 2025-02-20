import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChooseToolPrompt, GameMessage } from 'ptcg-server';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../../api/api.module';
import { PromptChooseToolComponent } from './prompt-choose-tool.component';

describe('PromptChooseToolComponent', () => {
  let component: PromptChooseToolComponent;
  let fixture: ComponentFixture<PromptChooseToolComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        TranslateModule.forRoot()
      ],
      declarations: [PromptChooseToolComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptChooseToolComponent);
    component = fixture.componentInstance;
    component.prompt = new ChooseToolPrompt(1, GameMessage.COIN_FLIP, [], {});
    component.gameState = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
