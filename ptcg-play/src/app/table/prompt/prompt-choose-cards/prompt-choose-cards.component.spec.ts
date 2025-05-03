import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CardList, ChooseCardsPrompt, GameMessage, Player } from 'ptcg-server';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../../api/api.module';
import { PromptChooseCardsComponent } from './prompt-choose-cards.component';

describe('PromptChooseCardsComponent', () => {
  let component: PromptChooseCardsComponent;
  let fixture: ComponentFixture<PromptChooseCardsComponent>;
  let mockPlayer: Player;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        TranslateModule.forRoot()
      ],
      declarations: [PromptChooseCardsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptChooseCardsComponent);
    component = fixture.componentInstance;
    component.gameState = {} as any;

    // Create a mock player
    mockPlayer = new Player();
    mockPlayer.id = 1;
    mockPlayer.name = 'Test Player';

    component.prompt = new ChooseCardsPrompt(mockPlayer, GameMessage.COIN_FLIP, new CardList(), {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});