import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';

import { ApiError } from '../../api/api.error';
import { DeckService } from '../../api/services/deck.service';
import { DeckStatsResponse, DeckStatsMatchup, DeckStatsReplay, Deck } from '../../api/interfaces/deck.interface';
import { AlertService } from '../../shared/alert/alert.service';
import { ReplayService } from '../../api/services/replay.service';
import { ArchetypeSelectPopupService } from '../archetype-select-popup/archetype-select-popup.service';
import { Archetype } from 'ptcg-server';

@UntilDestroy()
@Component({
  selector: 'ptcg-deck-stats',
  templateUrl: './deck-stats.component.html',
  styleUrls: ['./deck-stats.component.scss']
})
export class DeckStatsComponent implements OnInit {

  public deckId: number;
  public loading = false;
  public stats: DeckStatsResponse | null = null;
  public deck: Deck | null = null;
  public displayedReplayColumns: string[] = ['opponent', 'date', 'result', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deckService: DeckService,
    private alertService: AlertService,
    private translate: TranslateService,
    private replayService: ReplayService,
    private archetypeSelectPopupService: ArchetypeSelectPopupService
  ) { }

  ngOnInit(): void {
    this.deckId = parseInt(this.route.snapshot.paramMap.get('deckId') || '0', 10);
    if (this.deckId) {
      this.loadDeck();
      this.loadStats();
    }
  }

  private loadDeck(): void {
    this.deckService.getDeck(this.deckId).pipe(
      untilDestroyed(this)
    ).subscribe(
      (response) => {
        this.deck = response.deck;
      },
      (error: ApiError) => {
        if (!error.handled) {
          this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
        }
      }
    );
  }

  private loadStats(): void {
    this.loading = true;
    this.deckService.getDeckStats(this.deckId).pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    ).subscribe(
      (response) => {
        this.stats = response;
      },
      (error: ApiError) => {
        if (!error.handled) {
          this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
        }
      }
    );
  }

  public formatWinRate(winRate: number): string {
    return winRate.toFixed(1) + '%';
  }

  public formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString();
  }

  public getMatchupWinRateClass(winRate: number): string {
    if (winRate >= 60) {
      return 'favorable';
    } else if (winRate >= 40) {
      return 'even';
    } else {
      return 'unfavorable';
    }
  }

  public viewReplay(matchId: number): void {
    this.loading = true;
    this.replayService.getMatchReplay(matchId)
      .pipe(
        finalize(() => { this.loading = false; }),
        untilDestroyed(this)
      )
      .subscribe({
        next: gameState => {
          if (gameState !== undefined) {
            this.router.navigate(['/table', gameState.localId]);
          }
        },
        error: (error: ApiError) => {
          if (!error.handled) {
            this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
          }
        }
      });
  }

  public goBack(): void {
    this.router.navigate(['/deck']);
  }

  public openArchetypeSelect(): void {
    if (!this.deck) {
      return;
    }

    const dialogRef = this.archetypeSelectPopupService.openDialog({
      deckId: this.deck.id,
      currentArchetype1: this.deck.manualArchetype1,
      currentArchetype2: this.deck.manualArchetype2
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onArchetypeChange(result.archetype1, result.archetype2);
      }
    });
  }

  public onArchetypeChange(archetype1: Archetype | null, archetype2: Archetype | null): void {
    if (!this.deck) {
      return;
    }

    const items = this.deck.cards;

    this.loading = true;
    this.deckService.saveDeck(
      this.deck.id,
      this.deck.name,
      items,
      archetype1 || undefined,
      archetype2 || undefined
    ).pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    ).subscribe(() => {
      this.alertService.toast(this.translate.instant('DECK_EDIT_SAVED'));
      this.loadDeck(); // Reload deck to get updated archetypes
    }, (error: ApiError) => {
      if (!error.handled) {
        this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
      }
    });
  }

  public convertArchetypeStringToEnum(archetypeString: string): Archetype | null {
    if (!archetypeString || archetypeString === 'UNKNOWN') {
      return Archetype.UNOWN;
    }

    // Handle combined archetype strings like "CHARIZARD/PIDGEOT"
    // Extract the first archetype (before "/") for icon display
    const primaryArchetype = archetypeString.split('/')[0].trim();

    // Try to find the enum key that matches the string
    // Match strings like "CHARIZARD", "PIKACHU" to enum keys like "CHARIZARD", "PIKACHU"
    const upperString = primaryArchetype.toUpperCase().replace(/\s+/g, '_');
    const enumKey = Object.keys(Archetype).find(key => key === upperString);

    if (enumKey) {
      return Archetype[enumKey] as Archetype;
    }

    // Try to find by value (in case it's already an enum value)
    const enumValue = Object.values(Archetype).find(value =>
      typeof value === 'string' && value.toUpperCase() === upperString
    );

    if (enumValue) {
      return enumValue as Archetype;
    }

    // Fallback to UNOWN if no match found
    return Archetype.UNOWN;
  }

  public getDeckArchetypes(): Archetype[] {
    if (!this.deck) {
      return [Archetype.UNOWN];
    }

    // If manual archetypes are set, use those
    if (this.deck.manualArchetype1 || this.deck.manualArchetype2) {
      const archetypes: Archetype[] = [];
      if (this.deck.manualArchetype1) {
        archetypes.push(this.deck.manualArchetype1);
      }
      if (this.deck.manualArchetype2) {
        archetypes.push(this.deck.manualArchetype2);
      }
      return archetypes.length > 0 ? archetypes : [Archetype.UNOWN];
    }

    // Fallback to UNOWN if no manual archetypes
    return [Archetype.UNOWN];
  }
}

