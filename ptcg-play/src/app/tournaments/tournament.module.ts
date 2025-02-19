import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Angular Material Imports
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

// Components
import { TournamentListComponent } from './components/tournament-list/tournament-list.component';
import { TournamentDetailComponent } from './components/tournament-detail/tournament-detail.component';
import { TournamentStandingsComponent } from './components/tournament-standings/tournament-standings.component';
import { TournamentPairingsComponent } from './components/tournament-pairings/tournament-pairings.component';
import { TournamentMetagameComponent } from './components/tournament-metagame/tournament-metagame.component';
import { TournamentRegistrationComponent } from './components/tournament-registration/tournament-registration.component';
import { TournamentCreateComponent } from './organizer/tournament-create/tournament-create.component';

// Guards and Services
import { TournamentOrganizerGuard } from './organizer/tournament-organizer.guard';
import { TournamentService } from '../api/services/tournament.service';
import { WebSocketService } from './service/tournament-socket.service';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';

const routes: Routes = [
  {
    path: 'tournaments',
    children: [
      { path: '', component: TournamentListComponent },
      {
        path: 'create',
        component: TournamentCreateComponent,
        canActivate: [TournamentOrganizerGuard]
      },
      { path: ':id', component: TournamentDetailComponent },
      { path: ':id/register', component: TournamentRegistrationComponent }
    ]
  }
];

@NgModule({
  declarations: [
    TournamentListComponent,
    TournamentDetailComponent,
    TournamentStandingsComponent,
    TournamentPairingsComponent,
    TournamentMetagameComponent,
    TournamentRegistrationComponent,
    TournamentCreateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),

    // Angular Material Modules
    MatExpansionModule,  // Changed from MatAccordionModule
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule,
    MatListModule,
    MatTabsModule
  ],
  providers: [
    TournamentService,
    WebSocketService,
    TournamentOrganizerGuard
  ],
  exports: [
    TournamentListComponent,
    TournamentDetailComponent,
    TournamentStandingsComponent,
    TournamentPairingsComponent,
    TournamentMetagameComponent,
    TournamentRegistrationComponent,
    TournamentCreateComponent
  ]
})
export class TournamentModule { }