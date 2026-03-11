import { Component, Input } from '@angular/core';

@Component({
  selector: 'ptcg-game-loading',
  templateUrl: './game-loading.component.html',
  styleUrls: ['./game-loading.component.scss']
})
export class GameLoadingComponent {
  @Input() message?: string;
}
