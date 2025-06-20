import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattlePassComponent } from './battle-pass.component';

describe('BattlePassComponent', () => {
  let component: BattlePassComponent;
  let fixture: ComponentFixture<BattlePassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BattlePassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BattlePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
