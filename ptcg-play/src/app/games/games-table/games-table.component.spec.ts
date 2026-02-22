import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { of } from 'rxjs';

import { GamesTableComponent } from './games-table.component';
import { SessionService } from '../../shared/session/session.service';

describe('GamesTableComponent', () => {
  let component: GamesTableComponent;
  let fixture: ComponentFixture<GamesTableComponent>;

  beforeEach(waitForAsync(() => {
    const sessionServiceSpy = jasmine.createSpyObj('SessionService', ['get']);
    // Mock the session service to return arrays with data
    sessionServiceSpy.get.and.returnValue(of([{ gameId: 1, players: [] }, { gameId: 2, players: [] }]));

    TestBed.configureTestingModule({
      imports: [
        MatTableModule
      ],
      declarations: [GamesTableComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: SessionService, useValue: sessionServiceSpy }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have displayedColumns defined', () => {
    expect(component.displayedColumns).toBeDefined();
    expect(component.displayedColumns.length).toBeGreaterThan(0);
  });

  it('should have games$ observable defined', () => {
    expect(component.games$).toBeDefined();
  });

  it('should implement OnDestroy', () => {
    expect(component.ngOnDestroy).toBeDefined();
  });

  it('should clean up on destroy', () => {
    const destroySpy = spyOn(component['destroy$'], 'next');
    const completeSpy = spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
