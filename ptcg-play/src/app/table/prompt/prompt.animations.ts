import { animate, state, style, transition, trigger, AnimationTriggerMetadata } from '@angular/animations';

/** Animations used by PtcgPrompt. */
export const ptcgPromptAnimations: {
  readonly promptContent: AnimationTriggerMetadata;
} = {
  /** Animation that is applied on the dialog container by default. */
  promptContent: trigger('state', [
    // Initial hidden state
    state('void, exit, minimize', style({
      opacity: 0,
      transform: 'scale(0.7)',
      transformOrigin: 'center center'
    })),

    // Fully visible state
    state('enter', style({
      transform: 'scale(1)',
      opacity: 1,
      transformOrigin: 'center center'
    })),

    // Enter animation - simple and snappy
    transition('* => enter', animate('150ms cubic-bezier(0, 0, 0.2, 1)',
      style({
        transform: 'scale(1)',
        opacity: 1
      })
    )),

    // Minimize animation - instant with no animation
    transition('enter => minimize', animate('0ms',
      style({
        opacity: 0,
        transform: 'scale(0.7)'
      })
    )),

    // Restore from minimized - only animate when opening
    transition('minimize => enter', animate('150ms cubic-bezier(0, 0, 0.2, 1)',
      style({
        transform: 'scale(1)',
        opacity: 1
      })
    )),

    // Confirm/Cancel animation - instant with no animation
    transition('enter => confirm', animate('0ms',
      style({
        opacity: 0,
        transform: 'scale(0.7)'
      })
    )),

    // Exit animation - instant with no animation
    transition('* => void, * => exit', animate('0ms',
      style({
        opacity: 0,
        transform: 'scale(0.7)'
      })
    )),
  ])
};