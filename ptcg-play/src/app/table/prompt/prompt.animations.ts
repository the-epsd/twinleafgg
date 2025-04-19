import { animate, state, style, transition, trigger, AnimationTriggerMetadata } from '@angular/animations';

/** Animations used by PtcgPrompt. */
export const ptcgPromptAnimations: {
  readonly promptContent: AnimationTriggerMetadata;
} = {
  /** Animation that is applied on the dialog container by default. */
  promptContent: trigger('state', [
    // Initial hidden state
    state('void, exit', style({
      opacity: 0,
      transform: 'scale(0.7)',
      transformOrigin: 'center center'
    })),

    // Fully visible state
    state('enter', style({
      transform: 'translate3d(0, 0, 0)'
    })),

    // Enter animation
    transition('* => enter', animate('150ms cubic-bezier(0, 0, 0.2, 1)',
      style({
        transform: 'translate3d(0, 0, 0)',
        opacity: 1
      })
    )),

    // Exit animation (slightly longer for better UX)
    transition('* => void, * => exit', animate('100ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      style({ opacity: 0 })
    )),
  ])
};