import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GameMessage, ShowCardsPrompt } from 'ptcg-server';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../../api/api.module';
import { PromptConfirmCardsComponent } from './prompt-confirm-cards.component';

describe('PromptConfirmCardsComponent', () => {
  let component: PromptConfirmCardsComponent;
  let fixture: ComponentFixture<PromptConfirmCardsComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        TranslateModule.forRoot()
      ],
      declarations: [PromptConfirmCardsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptConfirmCardsComponent);
    component = fixture.componentInstance;
    component.prompt = new ShowCardsPrompt(1, GameMessage.COIN_FLIP, []);
    component.gameState = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
