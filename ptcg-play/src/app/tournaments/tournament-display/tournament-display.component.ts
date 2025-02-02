// bracket-display.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bracket-display',
  templateUrl: './tournament-display.component.html',
  styleUrls: ['./tournament-display.component.scss']
})
export class BracketDisplayComponent {
  @Input() bracket: any[][];

  reportWinner(roundIndex: number, matchIndex: number, winner: string) {
    // Implement logic to update the bracket
  }
}
