import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TournamentFormat } from '../../model/tournament.model';
import { TournamentService } from '../../service/tournament.service';

@Component({
  selector: 'app-tournament-create',
  template: `
    <mat-card class="create-tournament-card">
      <mat-card-header>
        <mat-card-title>Create Tournament</mat-card-title>
      </mat-card-header>

      <form [formGroup]="tournamentForm" (ngSubmit)="onSubmit()">
        <mat-card-content>
          <mat-form-field appearance="fill">
            <mat-label>Tournament Name</mat-label>
            <input matInput formControlName="name" required>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Format</mat-label>
            <mat-select formControlName="format" required>
              <mat-option *ngFor="let format of formats" [value]="format">
                {{format}}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date" required>
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Number of Rounds</mat-label>
            <input matInput type="number" formControlName="rounds" required>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Max Players</mat-label>
            <mat-select formControlName="maxPlayers" required>
              <mat-option *ngFor="let size of playerSizes" [value]="size">
                {{size}}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-checkbox formControlName="hasTopCut">Include Top 8 Cut</mat-checkbox>

          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Tournament Description</mat-label>
            <textarea matInput 
                      formControlName="description" 
                      rows="10"
                      placeholder="Enter tournament details, rules, and any other important information...">
            </textarea>
          </mat-form-field>
        </mat-card-content>

        <mat-card-actions>
          <button mat-button type="button" routerLink="/tournaments">Cancel</button>
          <button mat-raised-button 
                  color="primary" 
                  type="submit"
                  [disabled]="!tournamentForm.valid">
            Create Tournament
          </button>
        </mat-card-actions>
      </form>
    </mat-card>
  `,
  styles: [`
    .create-tournament-card {
      max-width: 800px;
      margin: 20px auto;
    }
    mat-form-field {
      width: 100%;
      margin: 8px 0;
    }
    .full-width {
      width: 100%;
    }
    mat-checkbox {
      margin: 16px 0;
      display: block;
    }
  `]
})
export class TournamentCreateComponent {
  tournamentForm: FormGroup;
  formats = Object.values(TournamentFormat);
  playerSizes = [2, 4, 8, 12, 16, 24, 32, 48, 64, 128, 256, 512, 1024, 2048];

  constructor(
    private fb: FormBuilder,
    private tournamentService: TournamentService,
    private router: Router
  ) {
    this.tournamentForm = this.fb.group({
      name: ['', Validators.required],
      format: [TournamentFormat.STANDARD, Validators.required],
      date: ['', Validators.required],
      rounds: ['', [Validators.required, Validators.min(1)]],
      maxPlayers: [32, Validators.required],
      hasTopCut: [false],
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.tournamentForm.valid) {
      const formValue = this.tournamentForm.value;
      const registrationDeadline = new Date(formValue.date);
      registrationDeadline.setMinutes(registrationDeadline.getMinutes() - 30);

      const tournament = {
        ...formValue,
        status: 'UPCOMING',
        currentRound: 0,
        registrationDeadline
      };

      this.tournamentService.createTournament(tournament)
        .subscribe(
          created => {
            this.router.navigate(['/tournaments', created.id]);
          },
          error => {
            console.error('Error creating tournament:', error);
            // Add error handling/notification here
          }
        );
    }
  }
}