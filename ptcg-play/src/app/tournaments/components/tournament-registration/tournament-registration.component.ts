import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tournament } from '../../model/tournament.model';
import { TournamentService } from '../../service/tournament.service';


@Component({
  selector: 'app-tournament-registration',
  template: `
    <mat-card class="registration-card" *ngIf="tournament">
      <mat-card-header>
        <mat-card-title>Register for {{tournament.name}}</mat-card-title>
        <mat-card-subtitle>
          Registration closes at {{tournament.registrationDeadline | date:'medium'}}
        </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <div class="tournament-info">
          <h3>Tournament Information</h3>
          <p>Format: {{tournament.format}}</p>
          <p>Date: {{tournament.date | date:'medium'}}</p>
          <p>Rounds: {{tournament.rounds}}</p>
          <pre>{{tournament.description}}</pre>
        </div>

        <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
          <h3>Decklist Submission</h3>
          <p>Please enter your decklist in the format specified by the tournament organizer.</p>
          
          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Decklist</mat-label>
            <textarea matInput 
                      formControlName="decklist" 
                      rows="15"
                      placeholder="Enter your decklist here...">
            </textarea>
            <mat-error *ngIf="registrationForm.get('decklist')?.hasError('required')">
              Decklist is required
            </mat-error>
          </mat-form-field>

          <mat-card-actions>
            <button mat-button type="button" routerLink="/tournaments">Cancel</button>
            <button mat-raised-button 
                    color="primary" 
                    type="submit"
                    [disabled]="!registrationForm.valid || !canRegister">
              Register
            </button>
          </mat-card-actions>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .registration-card {
      max-width: 800px;
      margin: 20px auto;
    }
    .tournament-info {
      margin-bottom: 24px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 4px;
    }
    .full-width {
      width: 100%;
    }
    pre {
      white-space: pre-wrap;
      font-family: inherit;
    }
  `]
})
export class TournamentRegistrationComponent implements OnInit {
  tournament: Tournament | null = null;
  registrationForm: FormGroup;
  canRegister = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private tournamentService: TournamentService
  ) {
    this.registrationForm = this.fb.group({
      decklist: ['', Validators.required]
    });
  }

  ngOnInit() {
    const tournamentId = +this.route.snapshot.params['id'];
    this.tournamentService.getTournamentById(tournamentId)
      .subscribe(
        tournament => {
          this.tournament = tournament;
          this.checkRegistrationEligibility();
        },
        error => {
          console.error('Error loading tournament:', error);
          this.router.navigate(['/tournaments']);
        }
      );
  }

  private checkRegistrationEligibility() {
    if (!this.tournament) return;

    const now = new Date();
    if (now > this.tournament.registrationDeadline) {
      this.canRegister = false;
      // Add notification that registration is closed
      return;
    }

    // Add additional checks (e.g., max players reached, already registered, etc.)
  }

  onSubmit() {
    if (this.registrationForm.valid && this.tournament && this.canRegister) {
      this.tournamentService.registerPlayer(
        this.tournament.id,
        'currentUserId', // Get this from your auth service
        this.registrationForm.value.decklist
      ).subscribe(
        response => {
          this.router.navigate(['/tournaments', this.tournament?.id]);
        },
        error => {
          console.error('Error registering for tournament:', error);
          // Add error handling/notification here
        }
      );
    }
  }
}