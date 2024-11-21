import { trigger, state, style, transition, animate, keyframes } from "@angular/animations";

export const coinFlipAnimation = trigger('flipState', [
  state('front', style({ transform: 'rotateY(0)' })),
  state('back', style({ transform: 'rotateY(180deg)' })),
  state('flipping', style({ transform: 'translateY(-150px) rotateX(720deg) rotateY(720deg)' })),
  transition('* => flipping', [
    animate('1.5s cubic-bezier(0.23, 1, 0.32, 1)', keyframes([
      style({ transform: 'translateY(0) rotateX(0) rotateY(0)', offset: 0 }),
      style({ transform: 'translateY(-260px) rotateX(360deg) rotateY(360deg)', offset: 0.4 }),
      style({ transform: 'translateY(-30px) rotateX(720deg) rotateY(720deg)', offset: 0.7 }),
      style({ transform: 'translateY(0) rotateX(1080deg) rotateY(1080deg)', offset: 1 })
    ]))
  ]),
  transition('flipping => *', animate('0s'))
]);
