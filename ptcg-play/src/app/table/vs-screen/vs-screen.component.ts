import { trigger, state, style, transition, animate } from "@angular/animations";
import { Component, HostBinding, HostListener, OnDestroy, OnInit } from "@angular/core";

@Component({
  selector: 'ptcg-vs-screen',
  templateUrl: './vs-screen.component.html',
  styleUrls: ['./vs-screen.component.scss'],
  animations: [
    trigger('vsState', [
      state('void', style({ display: 'none' })),
      state('visible', style({ display: 'block' })),
      transition('visible => void', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class VsScreenComponent implements OnInit {
  isVisible = true;
  player2: any;
  player1: any;

  get player2Avatar(): string {
    return this.player2?.avatar || 'assets/avatar.svg';
  }


  get player1Avatar(): string {
    return this.player1?.avatar || 'assets/avatar.svg';
  }

  ngOnInit() {
    setTimeout(() => {
      this.isVisible = false;
    }, 3500);
  }

  @HostListener('@vsState.done', ['$event'])
  onAnimationDone(event: any) {
    if (event.toState === 'void') {
      this.isVisible = false;
    }
  }
}